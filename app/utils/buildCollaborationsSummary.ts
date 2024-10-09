import { Artist, Song } from "~/types/genius.types";

type ArtistCollaborationSummary = {
  artist: Artist;
  rank: number;
  songs: Song[];
}[];

export default function buildCollaborationsSummary(
  artistId: number,
  songs: Song[],
): ArtistCollaborationSummary {
  const artists: Record<number, Artist> = {};
  const collabs: Record<number, Song[]> = {};

  for (const song of songs) {
    for (const artist of [...song.primary_artists, ...song.featured_artists]) {
      if (artist.id === artistId) {
        continue;
      }
      if (artist.id in collabs) {
        collabs[artist.id].push(song);
      } else {
        collabs[artist.id] = [song];
        artists[artist.id] = artist;
      }
    }
  }

  const collabSummary: ArtistCollaborationSummary = [];
  for (const [artistId, songs] of Object.entries(collabs)) {
    collabSummary.push({
      artist: artists[+artistId],
      rank: 0,
      songs,
    });
  }

  // sort by number of collaborations descending
  collabSummary.sort((a, b) => b.songs.length - a.songs.length);
  for (let i = 0; i < collabSummary.length; i++) {
    collabSummary[i].rank = i + 1;
  }

  return collabSummary;
}
