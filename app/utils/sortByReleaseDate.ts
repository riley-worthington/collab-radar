import { Song } from "~/types/genius.types";

export default function sortByReleaseDate(songs: Song[]) {
  return songs.sort((a, b) => {
    if (!a.release_date_for_display) return 1;
    if (!b.release_date_for_display) return -1;
    return (
      new Date(b.release_date_for_display).getTime() -
      new Date(a.release_date_for_display).getTime()
    );
  });
}
