import {
  Artist,
  ArtistResponse,
  GeniusResponse,
  SearchResponse,
  Song,
  SongsResponse,
} from "~/types/genius.types";
import { getCache, setCache } from "./redis.server";
import chunkData from "./chunkData";
import cacheInChunks from "./cacheInChunks";
import { genius } from "./api.server";
import Fuse, { IFuseOptions } from "fuse.js";

async function getAllSongsByArtist(artistId: string): Promise<Song[]> {
  const songs = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: "50",
    });
    const apiUrl = `/artists/${artistId}/songs?${params}`;
    const { data } = await genius.get<GeniusResponse<SongsResponse>>(apiUrl);

    // only save the data we need
    const songResponse = data.response.songs.map((song) => {
      return {
        id: song.id,
        title: song.title,
        title_with_featured: song.title_with_featured,
        url: song.url,
        release_date_for_display: song.release_date_for_display,
        primary_artists: song.primary_artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
        header_image_url: song.header_image_url,
        song_art_image_thumbnail_url: song.song_art_image_thumbnail_url,
        featured_artists: song.featured_artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
      };
    });

    songs.push(...songResponse);

    if (data.response.next_page) {
      totalPages = data.response.next_page;
    }

    page++;
  }

  return songs as Song[];
}

export async function getArtistSongs(artistId: string): Promise<Song[]> {
  const cacheKey = `artist:${artistId}:songs`;
  const chunkCount = await getCache<number>(`${cacheKey}:chunk_count`);

  if (chunkCount) {
    const songs = [];

    for (let i = 0; i < chunkCount; i++) {
      const chunk = await getCache<Song[]>(`${cacheKey}:chunk_${i}`);
      if (chunk) {
        songs.push(...chunk);
      }
    }

    console.log("Returning chunked cached data");
    return songs;
  }

  // If no cache, fetch from the Genius API
  const songs = await getAllSongsByArtist(artistId);

  // Cache the result before returning it
  const songChunks = chunkData<Song>(songs);
  await cacheInChunks(cacheKey, songChunks);

  return songs;
}

export async function getArtist(artistId: string): Promise<Artist> {
  const cacheKey = `artist:${artistId}`;

  // Check cache first
  const cachedData = await getCache<Artist>(cacheKey);
  if (cachedData) {
    console.log("Returning cached data");
    return cachedData;
  }

  // If no cache, fetch from the Genius API
  const apiUrl = `/artists/${artistId}`;
  const { data } = await genius.get<GeniusResponse<ArtistResponse>>(apiUrl);

  const artist = data.response.artist;

  // Cache the result before returning it
  await setCache(cacheKey, artist);

  return artist;
}

export async function searchArtists(query: string): Promise<Artist[]> {
  const params = new URLSearchParams({ q: query });
  const quotedParams = new URLSearchParams({ q: `"${query}"` }); // also search for the query with quotes around it for exact matches

  const apiUrl = `/search?${params}`;
  const quotedApiUrl = `/search?${quotedParams}`;

  const [res1, res2] = await Promise.all([
    genius.get<GeniusResponse<SearchResponse>>(apiUrl),
    genius.get<GeniusResponse<SearchResponse>>(quotedApiUrl),
  ]);

  const hits = [...res1.data.response.hits, ...res2.data.response.hits];

  const artists: Artist[] = [];
  for (const hit of hits) {
    for (const artist of hit.result.primary_artists) {
      if (!artists.some((a) => a.id === artist.id)) {
        artists.push(artist);
      }
    }
    for (const artist of hit.result.featured_artists) {
      if (!artists.some((a) => a.id === artist.id)) {
        artists.push(artist);
      }
    }
  }

  // fuzzy search the results
  const options: IFuseOptions<Artist> = {
    ignoreLocation: true,
    threshold: 0.2,
    keys: ["name"],
  };

  const fuse = new Fuse(artists, options);

  const searchResults = fuse.search(query);
  return searchResults.map((result) => result.item);
}
