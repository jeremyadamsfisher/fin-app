import type { ITransaction } from "../lib/backend";
import { useCallback, Fragment, useRef } from "react";
import * as C from "@chakra-ui/react";
import { useUpdateTransaction } from "../lib/backend";
import { BiNote } from "react-icons/bi";

export function Notes({ transaction }: { transaction: ITransaction }) {
  const { isOpen, onOpen: onOpenModal, onClose } = C.useDisclosure();
  const textAreaRef = useRef<HTMLTextAreaElement>(null); // weirdly, null is required here
  const updateTransaction = useUpdateTransaction();

  const onOpen = useCallback(() => {
    onOpenModal();
    // wait for initial render, otherwise `textAreaRef` may be undefined
    setTimeout(() => {
      const textArea = textAreaRef.current;
      if (!textArea) return;
      textArea.value = transaction.notes || "";
      textArea.selectionStart = textArea.value.length;
      textArea.selectionEnd = textArea.value.length;
      textArea.focus();
    }, 50);
  }, [onOpenModal, transaction.notes]);

  const onSave = useCallback(() => {
    updateTransaction(transaction.id, {
      notes: textAreaRef.current?.value || "",
    });
    onClose();
  }, [transaction.id, updateTransaction, onClose]);

  const onClear = useCallback(() => {
    updateTransaction(transaction.id, { notes: "" });
    onClose();
  }, []);

  return (
    <Fragment>
      {transaction.notes === "" ? (
        <C.IconButton
          onClick={onOpen}
          aria-label={"Edit Notes"}
          icon={<BiNote />}
        />
      ) : (
        <C.Text
          onClick={onOpen}
          p={1}
          rounded={"md"}
          _hover={{
            bg: "gray.600",
            transitionTimingFunction: "ease-in-out",
            transitionDuration: "0.4s",
          }}
        >
          {transaction?.notes?.slice(0, 50)}
        </C.Text>
      )}
      <C.Modal isOpen={isOpen} onClose={onClose}>
        <C.ModalOverlay />
        <C.ModalContent>
          <C.ModalHeader>Edit Note</C.ModalHeader>
          <C.ModalCloseButton />
          <C.ModalBody>
            <C.Textarea ref={textAreaRef} />
          </C.ModalBody>
          <C.ModalFooter>
            <C.Flex gap={2}>
              <C.Button colorScheme={"blue"} onClick={onSave}>
                Save
              </C.Button>
              <C.Button colorScheme={"red"} onClick={onClear}>
                Clear
              </C.Button>
              <C.Button onClick={onClose}>Cancel</C.Button>
            </C.Flex>
          </C.ModalFooter>
        </C.ModalContent>
      </C.Modal>
    </Fragment>
  );
}
