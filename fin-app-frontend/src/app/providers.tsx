"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { MultiSelectTheme } from "chakra-multiselect";
import { extendTheme } from "@chakra-ui/react";
import { PocketbaseProvider } from "@/lib/backend";

const theme = extendTheme({
  components: {
    MultiSelect: MultiSelectTheme,
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <PocketbaseProvider>{children}</PocketbaseProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
