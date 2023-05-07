"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { MultiSelectTheme } from "chakra-multiselect";
import { extendTheme } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    MultiSelect: MultiSelectTheme,
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider theme={theme}>
      <ColorModeScript />
      <ChakraProvider>{children}</ChakraProvider>
    </CacheProvider>
  );
}
