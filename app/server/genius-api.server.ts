import {
  Artist,
  ArtistResponse,
  GeniusResponse,
  Song,
  SongsResponse,
} from "~/types/genius.types";
import { getCache, setCache } from "./redis.server";

const GENIUS_API_URL = process.env.GENIUS_API_URL;
const GENIUS_API_TOKEN = process.env.GENIUS_API_TOKEN;

async function getAllSongsByArtist(artistId: string): Promise<Song[]> {
  const songs = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: "50",
    });
    const apiUrl = `${GENIUS_API_URL}/artists/${artistId}/songs?${params}`;
    const data =
      await fetchFromGeniusApi<GeniusResponse<SongsResponse>>(apiUrl);

    songs.push(...data.response.songs);

    if (data.response.next_page) {
      totalPages = data.response.next_page;
    }

    page++;
  }

  return songs;
}

async function fetchFromGeniusApi<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${GENIUS_API_TOKEN}` },
  });
  const data = await response.json();
  return data;
}

export async function getArtistSongs(artistId: string): Promise<Song[]> {
  const cacheKey = `artist_songs_${artistId}`;

  // Check cache first
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    console.log("Returning cached data");
    return cachedData as Song[];
  }

  // If no cache, fetch from the Genius API
  const data = await getAllSongsByArtist(artistId);

  // Cache the result before returning it
  await setCache(cacheKey, data);

  return data;
}

export async function getArtist(artistId: string): Promise<Artist> {
  const cacheKey = `artist_${artistId}`;

  // Check cache first
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    console.log("Returning cached data");
    return cachedData as Artist;
  }

  // If no cache, fetch from the Genius API
  const apiUrl = `${GENIUS_API_URL}/artists/${artistId}`;
  const data = await fetchFromGeniusApi<GeniusResponse<ArtistResponse>>(apiUrl);

  const artist = data.response.artist;

  // Cache the result before returning it
  await setCache(cacheKey, artist);

  return artist;
}
