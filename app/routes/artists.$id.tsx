import { Center, Box, Flex } from "@mantine/core";
import { Suspense } from "react";
import { LoaderFunctionArgs, defer } from "@remix-run/node";
import {
  useLoaderData,
  useParams,
  Await,
  MetaFunction,
} from "@remix-run/react";
import { getArtist, getArtistSongs } from "~/server/genius-api.server";
import ArtistPageHeader from "~/components/ArtistPageHeader";
import SongsDisplay from "~/components/SongsDisplay";
import SongsLoading from "~/components/SongsLoading";
import CollaborationsSummary from "~/components/CollaborationsSummary";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const artistId = params.id!;
  const songs = getArtistSongs(artistId);
  const artist = await getArtist(artistId);

  return defer({ artist, songs });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = `${data?.artist.name} - collab radar`;
  return [
    { title },
    {
      name: "description",
      content: `see collabs and features for ${data?.artist.name}`,
    },
    {
      property: "og:title",
      content: title,
    },
  ];
};

export default function ArtistPage() {
  const params = useParams();
  const artistId = params.id!;
  const { artist, songs } = useLoaderData<typeof loader>();

  return (
    <Box>
      <ArtistPageHeader artist={artist} />
      <Center>
        <Box maw={1200} w="100%" h="8rem">
          <Suspense fallback={<SongsLoading />} key={artistId}>
            <Await resolve={songs}>
              {(songs) => (
                <Flex gap="2rem" justify="space-between">
                  <Box maw={800} w="max-content">
                    <SongsDisplay artistId={artistId} songs={songs} />
                  </Box>
                  <Box w={300}>
                    <CollaborationsSummary artistId={artistId} songs={songs} />
                  </Box>
                </Flex>
              )}
            </Await>
          </Suspense>
        </Box>
      </Center>
    </Box>
  );
}
