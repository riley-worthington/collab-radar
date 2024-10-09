import { ActionIcon, Box, Flex, Text, TextInput } from "@mantine/core";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import ArtistSearchResults from "~/components/ArtistSearchResults";
import { searchArtists } from "~/server/genius-api.server";
import classes from "../styles/HomePage.module.css";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

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

  const submitSearch = () => {
    setSearchParams({ q: searchText });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submitSearch();
    }
  };

  return (
    <Flex
      mt="1rem"
      h="100%"
      mih="60vh"
      direction="column"
      justify={search ? "flex-start" : "center"}
      align="center"
    >
      {!search && (
        <Text size="2rem" ta="center" mb="4rem" fw="bold" c="#dad6ad">
          discover where your favorite artists have left their mark.
        </Text>
      )}
      <TextInput
        placeholder="Search artists"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyUp={handleKeyPress}
        size="xl"
        w={500}
        classNames={{
          input: classes["searchbar-input"],
        }}
        rightSection={
          <ActionIcon
            variant="transparent"
            onClick={submitSearch}
            className={classes["search-icon"]}
          >
            <MagnifyingGlassIcon />
          </ActionIcon>
        }
      />

      <Box>
        {!hits ? null : hits.length > 0 ? (
          <ArtistSearchResults artists={hits} />
        ) : (
          <Text mt="1rem">No results</Text>
        )}
      </Box>
    </Flex>
  );
}
