"use client";

import { Button, Flex, Spacer, Box, Text } from "@chakra-ui/react";
import FileUploader from "../components/FileUploader";
import Transactions from "../components/Transactions";
import { BiLogOut } from "react-icons/bi";

export default function Home() {
  return (
    <Flex h="100vh" direction={"row"}>
      <Box w={"20%"} bg={"gray.900"} p={5}>
        <Flex direction={"column"} h={"100%"}>
          <Text fontWeight={"bold"} fontSize={"2xl"} mb={5}>
            Fin Dash 💸💸💸
          </Text>
          <FileUploader />
          <Spacer />
          <Button leftIcon={<BiLogOut />} variant={"outline"} mt={5}>
            Log out
          </Button>
        </Flex>
      </Box>
      <Box w={"80%"} p={5}>
        <Transactions />
      </Box>
    </Flex>
  );
}
