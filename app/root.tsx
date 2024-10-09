import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Anchor,
  AppShell,
  ColorSchemeScript,
  createTheme,
  MantineProvider,
} from "@mantine/core";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import classes from "./styles/HomePage.module.css";

import "@fontsource-variable/montserrat";
import "@mantine/core/styles.css";

const theme = createTheme({
  fontFamily: "Montserrat Variable, sans-serif",
  headings: { fontFamily: "Montserrat Variable, sans-serif" },
  components: {
    Anchor: Anchor.extend({
      defaultProps: { c: "white" },
    }),
  },
  defaultRadius: 0,
});

export const meta: MetaFunction = () => [
  { title: "collab radar" },
  {
    name: "description",
    content: "discover where your favorite artists have left their mark",
  },
  {
    property: "og:title",
    content: "collab radar",
  },
];

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <AppShell
            header={{ height: 60 }}
            footer={{ height: 40 }}
            padding={0}
            className={classes.home}
          >
            <AppHeader />
            <AppShell.Main pb={0}>{children}</AppShell.Main>
            <AppFooter />
          </AppShell>
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
