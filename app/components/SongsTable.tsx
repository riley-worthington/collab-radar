import {
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Image,
  Badge,
  Anchor,
} from "@mantine/core";
import { Link } from "@remix-run/react";
import { Song } from "~/types/genius.types";
import isCredited from "~/utils/isCredited";
import isFeaturedIn from "~/utils/isFeaturedIn";
import sortByReleaseDate from "~/utils/sortByReleaseDate";

type Props = {
  artistId: string;
  songs: Song[];
  showCreditDetails?: boolean;
};

const SongsTable = ({ artistId, songs, showCreditDetails }: Props) => {
  const sortedSongs = sortByReleaseDate(songs);

  return (
    <Table>
      <TableThead>
        <TableTr>
          <TableTh w="1%" />
          <TableTh>Title</TableTh>
          <TableTh>Artist</TableTh>
          <TableTh>Release Date</TableTh>
          {showCreditDetails && <TableTh />}
        </TableTr>
      </TableThead>
      <TableTbody>
        {sortedSongs.map((song) => (
          <TableTr key={song.id}>
            <TableTd>
              <Image
                src={song.song_art_image_thumbnail_url}
                alt={song.title}
                w={100}
                h={100}
                onError={(e) => console.log(e)}
              />
            </TableTd>
            <TableTd>
              <Anchor target="_blank" href={song.url}>
                {song.title_with_featured}
              </Anchor>
            </TableTd>
            <TableTd>
              {song.primary_artists.map((artist) => (
                <Anchor
                  key={artist.id}
                  component={Link}
                  to={`/artists/${artist.id}`}
                >
                  {artist.name}
                </Anchor>
              ))}
            </TableTd>
            <TableTd>
              {song.release_date_for_display || (
                <Badge color="red">Unreleased</Badge>
              )}
            </TableTd>
            {showCreditDetails && (
              <TableTd>
                {isFeaturedIn(+artistId, song) && (
                  <Badge w="max-content">Feature</Badge>
                )}
                {isCredited(+artistId, song) && (
                  <Badge w="max-content" color="green">
                    Credit
                  </Badge>
                )}
              </TableTd>
            )}
          </TableTr>
        ))}
      </TableTbody>
    </Table>
  );
};

export default SongsTable;
