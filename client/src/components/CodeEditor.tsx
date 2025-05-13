import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-solarized_light";
import 'ace-builds/src-noconflict/worker-javascript';
import "ace-builds/src-noconflict/ext-language_tools";

import { getPastelIndexFor } from '@utils/colors';
import { useColorMode } from '@components/ui/color-mode';
import { Marker } from '../interfaces';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import { RefObject, useEffect } from 'react';

interface CodeEditorProps {
  code: string;
  isEditMode: boolean;
  onChangeCode: (code: string) => void;
  markers: Array<Marker>;
  ref?: RefObject<HTMLDivElement | null>;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  isEditMode,
  markers,
  onChangeCode,
  ref,
}) => {
  const convertCodeIndexToRowCol = (code: string, index: number) => {
    let col = 0;
    let row = 0;
    let head = 0;
    while (head < index) {
      col += 1;

      if (code[head - 1] === "\n") {
        row += 1;
        col = 1;
      }

      head += 1;
      if (head >= code.length) {
        throw new Error(`head=${head}, code.length=${code.length}`);
      }
    }

    if (code[head - 1] === "\n") {
      row += 1;
      col = 0;
    }

    return { row, col };
  };

  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  useEffect(() => {

  }, [isMobile])

  return (
    <Box ref={ref} height="100%">
      <AceEditor
        mode="javascript"
        theme={colorMode === "light" ? "solarized_light" : "monokai"}
        name="code-editor"
        value={code}
        style={{
          width: "100%",
          height: "100%",
          boxShadow: `
            0px 2px 4px color-mix(in srgb, black 64%, transparent),
            0px 0px 1px inset
            color-mix(in srgb, var(--chakra-colors-gray-300) 30%, transparent)`,
          lineHeight: isMobile ? "12px" : "16px",
        }}
        focus={true}
        markers={markers?.map(({ start, end }, idx) => ({
          startRow: convertCodeIndexToRowCol(code, +start).row,
          startCol: convertCodeIndexToRowCol(code, +start).col,
          endRow: convertCodeIndexToRowCol(code, +end).row,
          endCol: convertCodeIndexToRowCol(code, +end).col,
          className: `active-function-marker${getPastelIndexFor(idx)}`,
          type: "text",
        }))}
        readOnly={!isEditMode}
        onChange={onChangeCode}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          enableMobileMenu: true,
          showLineNumbers: true,
          showGutter: true,
          highlightGutterLine: isEditMode,
          highlightActiveLine: isEditMode,
          fontSize: isMobile ? 10 : 14,
          showPrintMargin: true,
          tabSize: 2,
          useWorker: false,
          enableMultiselect: true,
          wrap: true,
        }}
      />
    </Box>
  );
};

export default CodeEditor;