"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import { PocketbaseProvider } from "@/lib/backend";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        <ColorModeScript initialColorMode={"dark"} />
        <PocketbaseProvider>{children}</PocketbaseProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
