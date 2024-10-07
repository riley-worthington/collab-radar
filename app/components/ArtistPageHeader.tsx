import { Artist } from "~/types/genius.types";
import { Avatar, BackgroundImage, Flex, Title } from "@mantine/core";
import classes from "./ArtistPageHeader.module.css";

type Props = {
  artist: Artist;
};
const ArtistPageHeader = ({ artist }: Props) => {
  return (
    <BackgroundImage
      src={artist.header_image_url}
      className={classes["image-container"]}
      mb="5rem"
    >
      <Flex w="100%" justify="center">
        <Flex
          align="flex-end"
          gap="1rem"
          className={classes["header-content"]}
          maw={1200}
          w="100%"
        >
          <Avatar
            size="15rem"
            src={artist.image_url}
            alt={artist.name}
            className={classes["artist-image"]}
          />
          <Title c="white" size="6rem" fw="bold">
            {artist.name}
          </Title>
        </Flex>
      </Flex>
    </BackgroundImage>
  );
};

export default ArtistPageHeader;
