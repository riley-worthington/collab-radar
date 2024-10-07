import { Center, Flex, Text } from "@mantine/core";
import classes from "./SongsLoading.module.css";

const SongsLoading = () => {
  return (
    <Center>
      <Flex align="center" gap={10}>
        <Text>loading artist catalog</Text>
        <div className={classes.spin}>💿</div>
      </Flex>
    </Center>
  );
};

export default SongsLoading;
