import { Anchor, Box, Text, Tabs, Checkbox, Group } from "@mantine/core";
import { useSearchParams } from "@remix-run/react";
import { Song } from "~/types/genius.types";
import isCredited from "~/utils/isCredited";
import isFeaturedIn from "~/utils/isFeaturedIn";
import SongsTable from "./SongsTable";
import { useState } from "react";

type Props = {
  artistId: string;
  songs: Song[];
};

const SongsDisplay = ({ artistId, songs }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTab = searchParams.get("tab") || "discography";

  const [tab, setTab] = useState<string>(selectedTab);
  const [filters, setFilters] = useState<string[]>(["credits", "features"]);

  const handleTabChange = (value: string | null) => {
    if (value) {
      setTab(value);
      setSearchParams(
        { tab: value },
        { preventScrollReset: true, replace: true },
      );
    }
  };

  const featuredSongs: Song[] = [];
  const creditedSongs: Song[] = [];
  const ownSongs: Song[] = [];

  for (const song of songs) {
    if (isFeaturedIn(+artistId, song)) {
      featuredSongs.push(song);
    } else if (isCredited(+artistId, song)) {
      creditedSongs.push(song);
    } else {
      ownSongs.push(song);
    }
  }

  const totalCollabSongs = creditedSongs.length + featuredSongs.length;

  const collabSongs: Song[] = [];
  if (filters.includes("credits")) {
    collabSongs.push(...creditedSongs);
  }
  if (filters.includes("features")) {
    collabSongs.push(...featuredSongs);
  }

  return (
    <Box>
      <Text size="sm" mb="1rem">
        Powered by{" "}
        <Anchor href="https://genius.com" target="_blank" inherit>
          Genius
        </Anchor>
      </Text>
      <Tabs value={tab} defaultValue="discography" onChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Tab value="discography">
            Discography ({ownSongs.length.toLocaleString()})
          </Tabs.Tab>
          <Tabs.Tab value="credits">
            Credits & Features ({totalCollabSongs.toLocaleString()})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="discography">
          <SongsTable artistId={artistId} songs={ownSongs} />
        </Tabs.Panel>

        <Tabs.Panel value="credits">
          <Checkbox.Group value={filters} onChange={setFilters} my="1rem">
            <Group justify="flex-end">
              <Checkbox value="credits" label="Credits" />
              <Checkbox value="features" label="Features" />
            </Group>
          </Checkbox.Group>
          <SongsTable
            artistId={artistId}
            songs={collabSongs}
            showCreditDetails
          />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

export default SongsDisplay;
