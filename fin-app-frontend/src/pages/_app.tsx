import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { PocketbaseProvider } from "../lib/backend";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <PocketbaseProvider>
        <Component {...pageProps} />
      </PocketbaseProvider>
    </ChakraProvider>
  );
}
