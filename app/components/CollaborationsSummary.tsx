import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Center,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { Link } from "@remix-run/react";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { Song } from "~/types/genius.types";
import buildCollaborationsSummary from "~/utils/buildCollaborationsSummary";

type Props = {
  artistId: string;
  songs: Song[];
};

const CollaborationsSummary = ({ artistId, songs }: Props) => {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const toggleShowAll = () => setShowAll((prev) => !prev);

  const collabSummary = useMemo(
    () => buildCollaborationsSummary(+artistId, songs),
    [artistId, songs],
  );

  let filteredCollabs = [...collabSummary];

  const options = {
    keys: ["artist.name"],
    shouldSort: false,
    threshold: 0.2,
  };
  const fuse = new Fuse(collabSummary, options);

  if (search) {
    const result = fuse.search(search);
    filteredCollabs = result.map((r) => r.item);
  }

  const displayedItems = showAll
    ? filteredCollabs
    : filteredCollabs.slice(0, 10);

  return (
    <Box>
      <Title order={3} ta="center" mb="1rem">
        Top Collaborators
      </Title>
      <TextInput
        my="1rem"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        rightSection={
          search && (
            <ActionIcon variant="transparent" onClick={() => setSearch("")}>
              <XMarkIcon />
            </ActionIcon>
          )
        }
      />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w="1%">#</Table.Th>
            <Table.Th>Artist</Table.Th>
            <Table.Th>Count</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {displayedItems.map((collab) => (
            <Table.Tr key={collab.artist.id}>
              <Table.Td>{collab.rank}</Table.Td>
              <Table.Td>
                <Anchor component={Link} to={`/artists/${collab.artist.id}`}>
                  {collab.artist.name}
                </Anchor>
              </Table.Td>
              <Table.Td>{collab.songs.length}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {filteredCollabs.length > 10 && (
        <Center>
          <Button variant="transparent" onClick={toggleShowAll} fw="normal">
            {showAll ? "Show less" : "Show all"}
          </Button>
        </Center>
      )}
    </Box>
  );
};

export default CollaborationsSummary;
