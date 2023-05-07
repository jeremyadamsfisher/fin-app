"use client";

import { Flex, Box } from "@chakra-ui/react";
import FileUploader from "../components/FileUploader";
import Transactions from "../components/Transactions";

export default function Home() {
  return (
    <Flex h="100vh">
      <Box w={"20%"} bg={"gray.900"} p={5}>
        <FileUploader />
      </Box>
      <Box w={"80%"} p={5}>
        <Transactions />
      </Box>
    </Flex>
  );
}
