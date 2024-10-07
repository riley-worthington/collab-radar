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
  Center,
  Box,
  Text,
  Chip,
  Group,
  NumberFormatter,
  Flex,
} from "@mantine/core";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  Link,
  useLoaderData,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { getArtist, getArtistSongs } from "~/server/genius-api.server";
import isCredited from "~/utils/isCredited";
import isFeaturedIn from "~/utils/isFeaturedIn";
import sortByReleaseDate from "~/utils/sortByReleaseDate";
import ArtistPageHeader from "~/components/ArtistPageHeader";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const artistId = params.id!;
  const songs = await getArtistSongs(artistId);
  const artist = await getArtist(artistId);

  return json({ artist, songs });
};

export default function ArtistPage() {
  const params = useParams();
  const artistId = params.id!;
  const { artist, songs } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("filter");

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
    <Box w="100vw">
      <ArtistPageHeader artist={artist} />
      <Center>
        <Box maw={1200} w="100%" h="8rem">
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
      </Center>
    </Box>
  );
}
