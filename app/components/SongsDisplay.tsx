import {
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Title,
  Image,
  Badge,
  Anchor,
  Box,
  Text,
  Chip,
  Group,
  NumberFormatter,
  Flex,
} from "@mantine/core";
import { Link, useSearchParams } from "@remix-run/react";
import { Song } from "~/types/genius.types";
import isCredited from "~/utils/isCredited";
import isFeaturedIn from "~/utils/isFeaturedIn";
import sortByReleaseDate from "~/utils/sortByReleaseDate";

type Props = {
  artistId: string;
  songs: Song[];
  filter: string | null;
};
const SongsDisplay = ({ artistId, songs, filter }: Props) => {
  const [, setSearchParams] = useSearchParams();
  const featuredSongs = songs.filter((song) => isFeaturedIn(+artistId, song));
  const creditedSongs = songs.filter((song) => isCredited(+artistId, song));

  let filteredSongs =
    filter === "features"
      ? featuredSongs
      : filter === "credits"
        ? creditedSongs
        : songs;

  filteredSongs = sortByReleaseDate(filteredSongs);

  return (
    <Box>
      <Flex justify="space-between" align="flex-start">
        <Box>
          <Title order={3}>
            Songs (<NumberFormatter value={songs.length} />)
          </Title>
          <Text c="gray">
            <NumberFormatter value={featuredSongs.length} /> features
          </Text>
          <Text c="gray">
            <NumberFormatter value={creditedSongs.length} /> credits
          </Text>
        </Box>
        <Flex direction="column" align="flex-end" gap=".5rem">
          <Text>Filter by</Text>
          <Chip.Group>
            <Group>
              <Chip
                checked={filter === "features"}
                onChange={() => {
                  setSearchParams((params) => {
                    if (params.get("filter") === "features") {
                      params.delete("filter");
                    } else {
                      params.set("filter", "features");
                    }
                    return params;
                  });
                }}
              >
                Features
              </Chip>
              <Chip
                checked={filter === "credits"}
                onChange={() => {
                  setSearchParams((params) => {
                    if (params.get("filter") === "credits") {
                      params.delete("filter");
                    } else {
                      params.set("filter", "credits");
                    }
                    return params;
                  });
                }}
              >
                Credits
              </Chip>
            </Group>
          </Chip.Group>
        </Flex>
      </Flex>
      <Table>
        <TableThead>
          <TableTr>
            <TableTh />
            <TableTh>Title</TableTh>
            <TableTh>Artist</TableTh>
            <TableTh>Release Date</TableTh>
            <TableTh />
          </TableTr>
        </TableThead>
        <TableTbody>
          {filteredSongs.map((song) => (
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
              <TableTd>
                {isFeaturedIn(+artistId, song) && (
                  <Badge w="max-content">Feature</Badge>
                )}
                {isCredited(+artistId, song) && (
                  <Badge color="green">Credit</Badge>
                )}
              </TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </Box>
  );
};

export default SongsDisplay;
