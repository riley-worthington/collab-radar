import { Anchor, AppShellFooter, Flex, Text } from "@mantine/core";
import github from "../assets/github-mark-white.svg";
import classes from "./AppFooter.module.css";

const AppFooter = () => {
  return (
    <AppShellFooter className={classes.footer}>
      <Flex align="center" justify="flex-end" h="100%" px="1rem">
        <Anchor
          href="https://github.com/riley-worthington/collab-radar"
          target="_blank"
        >
          <Flex align="center" gap=".5rem">
            <Text size="sm">view on github</Text>
            <img src={github} alt="GitHub logo" width={20} height={20} />
          </Flex>
        </Anchor>
      </Flex>
    </AppShellFooter>
  );
};

export default AppFooter;
