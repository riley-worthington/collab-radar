import { Anchor, Avatar, Flex, Text } from "@mantine/core";
import { Link } from "@remix-run/react";
import { Artist } from "~/types/genius.types";

type Props = {
  artists: Artist[];
};

const ArtistSearchResults = ({ artists }: Props) => {
  return (
    <Flex direction="column" gap="1rem" mt="2rem">
      {artists.map((artist) => (
        <Anchor
          component={Link}
          to={`/artists/${artist.id}`}
          underline="never"
          key={artist.id}
        >
          <Flex align="center" gap="1rem">
            <Avatar src={artist.image_url} alt={artist.name} size="5rem" />
            <Text size="xl">{artist.name}</Text>
          </Flex>
        </Anchor>
      ))}
    </Flex>
  );
};

export default ArtistSearchResults;
