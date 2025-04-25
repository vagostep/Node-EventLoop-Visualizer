import { Button, Text } from "@chakra-ui/react";
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
          size="lg"
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
        >
          <HiOutlineCode />
          <Text textStyle="xl" fontWeight="semibold">
            Edit
          </Text>
        </Button>
      ) : (
        <Button
          size="lg"
          variant="surface"
          bg="#339933"
          borderRadius="0px"
          shadow="sm"
          onClick={onButtonRunClick}
          loading={isLoading}
          spinnerPlacement="start"
          width="26%"
          _hover={{
            bg: "#99cc7d",
            borderColor: "transparent",
          }}
        >
          <AiOutlineSend fontWeight="semibold" />
          {!isLoading ? (
            <Text textStyle="xl" fontWeight="semibold">
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