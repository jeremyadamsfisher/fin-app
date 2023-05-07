import { Box, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { TagSelector } from "./TagSelector";

export default function Transactions() {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Date</Th>
          <Th>Description</Th>
          <Th>Amount</Th>
          <Th>Tags</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>iPhone 12 Pro</Td>
          <Td>$999</Td>
          <Td>October 23, 2020</Td>
          <Td>
            <Box>
              <TagSelector />
            </Box>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
}
