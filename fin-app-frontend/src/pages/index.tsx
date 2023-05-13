import { Button, Flex, Spacer, Box, Text } from "@chakra-ui/react";
import FileUploader from "../components/StatementUploader";
import TransactionTable from "../components/TransactionsTable";
import { BiLogOut } from "react-icons/bi";

export default function Home() {
  return (
    <Flex h="100vh" direction={"row"}>
      <Box w={"20%"} bg={"gray.900"} p={5}>
        <Flex direction={"column"} h={"100%"}>
          <Text
            fontWeight={"bold"}
            fontSize={"2xl"}
            mb={5}
            w={"100%"}
            textAlign={"center"}
          >
            FIN DASH
          </Text>
          <FileUploader />
          <Spacer />
          <Button leftIcon={<BiLogOut />} variant={"outline"} mt={5}>
            Log out
          </Button>
        </Flex>
      </Box>
      <Box w={"80%"} p={5}>
        <TransactionTable />
      </Box>
    </Flex>
  );
}
