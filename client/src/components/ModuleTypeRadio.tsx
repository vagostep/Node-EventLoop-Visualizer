import React from "react";
import { HStack, RadioCard } from "@chakra-ui/react"
import { useColorModeValue } from "./ui/color-mode";
import { MODULETYPES } from "../constants";

export interface ValueChangeDetails {
   value: string | null;
}

export interface ModuleTypeRadioProps {
  isEditMode?: boolean;
  isLoading?: boolean;
  onValueChange: ((details: ValueChangeDetails) => void) | undefined;
}

const ModuleTypeRadio: React.FC<ModuleTypeRadioProps> = ({
    isEditMode,
    isLoading,
    onValueChange,
}) => {

    const fontColor = useColorModeValue('#1a1a1a', '#ffffff');
    const borderColor = useColorModeValue("#339933", "#ffffff");

    return (
        <RadioCard.Root 
            defaultValue="cjs"
            disabled={!isEditMode || isLoading} 
            onValueChange={onValueChange} 
            >
            <HStack align="stretch">

                <RadioCard.Item key="cjs" value="cjs" cursor="pointer" _disabled={{ background: "none"}} _checked={{ boxShadowColor: borderColor, borderColor: borderColor }} >
                    <RadioCard.ItemHiddenInput />
                    <RadioCard.ItemControl _disabled={{ background: "none", cursor: "default"}}>
                    <RadioCard.ItemText color={fontColor}>{MODULETYPES.COMMONJS}</RadioCard.ItemText>
                    <RadioCard.ItemIndicator color={borderColor} _checked={{ borderColor: borderColor, background: borderColor }} />
                    </RadioCard.ItemControl>
                </RadioCard.Item>
                <RadioCard.Item key="esm" value="esm" cursor="pointer" _checked={{ boxShadowColor: borderColor, borderColor: borderColor }} >
                    <RadioCard.ItemHiddenInput />
                    <RadioCard.ItemControl _disabled={{ background: "none", cursor: "default" }}>
                    <RadioCard.ItemText color={fontColor}>{MODULETYPES.ESM}</RadioCard.ItemText>
                    <RadioCard.ItemIndicator color={borderColor} _checked={{ borderColor: borderColor, background: borderColor }} />
                    </RadioCard.ItemControl>
                </RadioCard.Item>
            </HStack>
        </RadioCard.Root>
    );
}

export default ModuleTypeRadio;