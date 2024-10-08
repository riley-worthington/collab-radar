import {
  Box,
  Button,
  Center,
  Flex,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import ArtistSearchResults from "~/components/ArtistSearchResults";
import { searchArtists } from "~/server/genius-api.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const search = searchParams.get("q") || "";

  if (!search) {
    return json({ hits: null });
  }

  const hits = await searchArtists(search);

  return json({ hits });
};

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { hits } = useLoaderData<typeof loader>();
  const search = searchParams.get("q") || "";
  const [searchText, setSearchText] = useState(search);

  console.log(hits);

  return (
    <>
      <Center>
        <Box>
          <Title my="1rem">Search artists</Title>
          <Flex>
            <TextInput
              placeholder="Search artists"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button onClick={() => setSearchParams({ q: searchText })}>
              Search
            </Button>
          </Flex>
        </Box>
      </Center>
      <Center>
        <Box>
          {!hits ? null : hits.length > 0 ? (
            <ArtistSearchResults artists={hits} />
          ) : (
            <Text mt="1rem">No results</Text>
          )}
        </Box>
      </Center>
    </>
  );
}
