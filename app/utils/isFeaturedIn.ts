import { Song } from "~/types/genius.types";

export default function isFeaturedIn(artistId: number, song: Song): boolean {
  return song.featured_artists.some((artist) => artist.id === artistId);
}
