import React from "react";
import { HStack, Switch, Text } from "@chakra-ui/react"
import { useColorModeValue } from "./ui/color-mode";

export interface CheckedChangeDetails {
    checked: boolean;
}

export interface ModuleTypeCheckProps {
  isEditMode?: boolean;
  isLoading?: boolean;
  onValueChange: ((details: CheckedChangeDetails) => void) | undefined;
}

const ModuleTypeCheck: React.FC<ModuleTypeCheckProps> = ({
    isEditMode,
    isLoading,
    onValueChange,
}) => {

    const fontColor = useColorModeValue('#1a1a1a', '#ffffff');

    return (
        <>
            <HStack gap="2" justifyContent="end">
                <Text color={fontColor}>CommonJs</Text>
                <Switch.Root 
                    size="md" 
                    disabled={!isEditMode || isLoading} 
                    onCheckedChange={onValueChange}
                >
                    <Switch.HiddenInput />
                    <Switch.Control 
                        _checked={{
                            bg: "#339933"
                        }}
                        bg="#e99c40"
                    />
                </Switch.Root>
                <Text color={fontColor}>ESModule</Text>
            </HStack>
        </>
    );
}

export default ModuleTypeCheck;