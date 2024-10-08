/* eslint-disable @typescript-eslint/no-explicit-any */
export type GeniusResponse<T> = {
  meta: Meta;
  response: T;
};

export type Meta = {
  status: number;
};

export type SongsResponse = {
  songs: Song[];
  next_page: number;
};

export type ArtistResponse = {
  artist: Artist;
};

export type Song = {
  annotation_count: number;
  api_path: string;
  artist_names: string;
  full_title: string;
  header_image_thumbnail_url: string;
  header_image_url: string;
  id: number;
  lyrics_owner_id: number;
  lyrics_state: LyricsState;
  path: string;
  primary_artist_names: string;
  pyongs_count: number | null;
  relationships_index_url: string;
  release_date_components: ReleaseDateComponents | null;
  release_date_for_display: null | string;
  release_date_with_abbreviated_month_for_display: null | string;
  song_art_image_thumbnail_url: string;
  song_art_image_url: string;
  stats: Stats;
  title: string;
  title_with_featured: string;
  url: string;
  featured_artists: Artist[];
  primary_artist: Artist;
  primary_artists: Artist[];
};

export type Artist = {
  api_path: string;
  header_image_url: string;
  id: number;
  image_url: string;
  is_meme_verified: boolean;
  is_verified: boolean;
  name: string;
  url: string;
  iq?: number;
};

export type LyricsState = "complete" | "unreleased";

export type ReleaseDateComponents = {
  year: number;
  month: number | null;
  day: number | null;
};

export type Stats = {
  unreviewed_annotations: number;
  hot: boolean;
  pageviews?: number;
};

export type SearchResponse = {
  hits: Hit[];
};

export type Hit = {
  highlights: any[];
  index: Index;
  type: Index;
  result: Result;
};

export type Index = "song";

export type Result = {
  annotation_count: number;
  api_path: string;
  artist_names: string;
  full_title: string;
  header_image_thumbnail_url: string;
  header_image_url: string;
  id: number;
  lyrics_owner_id: number;
  lyrics_state: LyricsState;
  path: string;
  primary_artist_names: string;
  pyongs_count: number;
  relationships_index_url: string;
  release_date_components: ReleaseDateComponents;
  release_date_for_display: string;
  release_date_with_abbreviated_month_for_display: string;
  song_art_image_thumbnail_url: string;
  song_art_image_url: string;
  stats: Stats;
  title: string;
  title_with_featured: string;
  url: string;
  featured_artists: Artist[];
  primary_artist: Artist;
  primary_artists: Artist[];
};
