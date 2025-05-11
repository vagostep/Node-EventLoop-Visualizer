import { Box } from "@chakra-ui/react";
import ExampleSelector from "./ExampleSelector";
import CodeEditorButtons from "./CodeEditorButtons";

export interface ExampleControllerProps {
  onValueChange: (code: string | undefined) => void;
  isEditMode: boolean;
  isLoading: boolean;
  onButtonEditClick: () => void;
  onButtonRunClick: () => void;
}

const ExampleController: React.FC<ExampleControllerProps> = ({
  onValueChange,
  isEditMode,
  isLoading,
  onButtonEditClick,
  onButtonRunClick
}) => {
  return (
    <Box height="100%" display="flex" alignItems="center" justifyContent="space-between">
      <ExampleSelector
        onValueChange={onValueChange}
        disabled={!isEditMode}
      ></ExampleSelector>
      <CodeEditorButtons
        isEditMode={isEditMode}
        isLoading={isLoading}
        onButtonEditClick={onButtonEditClick}
        onButtonRunClick={onButtonRunClick}
      ></CodeEditorButtons>
    </Box>
  );
}

export default ExampleController;