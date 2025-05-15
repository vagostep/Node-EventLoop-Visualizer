import { Button, Icon, Text } from "@chakra-ui/react";
import React, { MouseEventHandler } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { HiOutlineCode } from "react-icons/hi";

export interface CodeEditorButtonsProps {
  isEditMode?: boolean;
  isLoading?: boolean;
  onButtonEditClick: MouseEventHandler<HTMLButtonElement>;
  onButtonRunClick: MouseEventHandler<HTMLButtonElement>;
}

const CodeEditorButtons: React.FC<CodeEditorButtonsProps> = ({
  isEditMode,
  isLoading,
  onButtonEditClick,
  onButtonRunClick,
}) => {

  return (
    <>
      {!isEditMode && !isLoading ? (
        <Button
          size={{ base: "sm", lg: "lg" }}
          variant="surface"
          bg="#e99c40"
          borderRadius="0px"
          shadow="sm"
          onClick={onButtonEditClick}
          width="26%"
          _hover={{
            bg: "#f5bc75",
            borderColor: "transparent",
          }}
          _focus={{
            outline: "none",
            borderRadius: "0px"
          }}
        >
          <Icon size={{ base: "md", lg: "xl" }} color="#fff">
            <HiOutlineCode />
          </Icon>
          
          <Text textStyle={{ base: "xs", lg: "lg" }} fontWeight="semibold" color="#fff">
            Edit
          </Text>
        </Button>
      ) : (
        <Button
          size={{ base: "sm", lg: "lg" }}
          variant="surface"
          bg="#339933"
          borderRadius="0px"
          shadow="md"
          onClick={onButtonRunClick}
          loading={isLoading}
          spinnerPlacement="start"
          width="26%"
          _hover={{
            bg: "#99cc7d",
            borderColor: "transparent",
          }}
          _focus={{
            outline: "none",
            borderRadius: "0px"
          }}
        >
          <AiOutlineSend fontWeight="semibold" color="#fff" />
          {!isLoading ? (
            <Text textStyle={{ base: "xs", lg: "lg" }} fontWeight="semibold" color="#fff">
              Run
            </Text>
          ) : (
            <></>
          )}
        </Button>
      )}
    </>
  );
};

export default CodeEditorButtons;