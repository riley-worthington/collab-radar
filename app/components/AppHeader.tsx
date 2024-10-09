import {
  ActionIcon,
  Anchor,
  AppShellHeader,
  Flex,
  Text,
  TextInput,
} from "@mantine/core";
import classes from "./AppHeader.module.css";
import { Link, useLocation, useNavigate } from "@remix-run/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const AppHeader = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const submitSearch = () => {
    navigate(`/?q=${searchValue}`);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submitSearch();
    }
  };

  return (
    <AppShellHeader withBorder={false} className={classes.header}>
      <Flex align="center" justify="space-between" px="2rem" h="100%">
        <Anchor component={Link} to="/" underline="never">
          <Text size="xl" fw={700} className={classes["logo-text"]}>
            🔊 collab radar
          </Text>
        </Anchor>
        {!isHomePage && (
          <TextInput
            placeholder="Search artists"
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            onKeyUp={handleKeyPress}
            rightSection={
              <ActionIcon variant="transparent" onClick={submitSearch}>
                <MagnifyingGlassIcon />
              </ActionIcon>
            }
          />
        )}
      </Flex>
    </AppShellHeader>
  );
};

export default AppHeader;
