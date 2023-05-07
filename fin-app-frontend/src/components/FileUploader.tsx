"use client";

import { IconButton, Flex, Button, Center, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoMdCloseCircle } from "react-icons/io";

export default function FileUploader() {
  const [csvs, setCsvs] = useState<File[]>([]);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => setCsvs([...csvs, ...acceptedFiles]),
    [setCsvs]
  );
  const onSubmit = useCallback(() => {
    // Do something with the files
    if (!csvs) return;
    const formData = new FormData();
    csvs.forEach((file) => formData.append("files", file));
    fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  }, [csvs]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Flex direction={"column"} gap={2} flexWrap={"wrap"}>
      <Center
        w={"100%"}
        h={csvs.length > 0 ? "auto" : 200}
        borderWidth={3}
        borderStyle={"dashed"}
        rounded={"md"}
        bg={isDragActive ? "gray.600" : "gray.800"}
        {...(csvs.length === 0 && getRootProps())}
      >
        <input {...getInputProps()} />
        {csvs ? (
          <Flex p={5} gap={5} wrap={"wrap"} justifyContent={"center"}>
            {csvs.map((file, i) => (
              <Center
                key={file.name}
                bg={"gray.700"}
                rounded={"md"}
                shadow={"md"}
                border={1}
                aspectRatio={1.5}
                px={5}
                pos="relative"
              >
                <Text fontWeight={"semibold"}>{file.name}</Text>
                <IconButton
                  icon={<IoMdCloseCircle />}
                  variant={"ghost"}
                  size={"sm"}
                  aria-label={"Close"}
                  pos={"absolute"}
                  top={-1}
                  right={-1}
                  onClick={() => setCsvs(csvs.filter((_, j) => j !== i))}
                />
              </Center>
            ))}
          </Flex>
        ) : (
          <Text>Drop n' drop</Text>
        )}
      </Center>
      <Button disabled={!csvs} onClick={onSubmit}>
        Upload
      </Button>
    </Flex>
  );
}
