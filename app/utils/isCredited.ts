import { Song } from "~/types/genius.types";
import isFeaturedIn from "./isFeaturedIn";

export default function isCredited(artistId: number, song: Song): boolean {
  return (
    !song.primary_artists.some((artist) => artist.id === artistId) &&
    !isFeaturedIn(artistId, song)
  );
}
