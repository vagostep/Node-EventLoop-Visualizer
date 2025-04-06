import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-solarized_light";
import 'ace-builds/src-noconflict/worker-javascript';
import "ace-builds/src-noconflict/ext-language_tools";

import { getPastelIndexFor } from '@utils/colors';
import { useColorMode } from '@components/ui/color-mode';
import styled from 'styled-components';

interface CodeEditorProps {
  code: string;
  locked: boolean;
  onChangeCode: (code: string) => void;
  markers: Array<any>;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  locked, 
  markers, 
  onChangeCode 
}) => {

  const convertCodeIndexToRowCol = (code: any, index: number) => {
    let col = 0;
    let row = 0;
    let head = 0;
    while (head < index) {
      col += 1;
  
      if (code[head - 1] === '\n') {
        row += 1;
        col = 1;
      }
  
      head += 1;
      if (head >= code.length) {
        throw new Error(`head=${head}, code.length=${code.length}`);
      }
    }
  
    if (code[head - 1] === '\n') {
      row += 1;
      col = 0;
    }
  
    return { row, col };
  };

  const { colorMode } = useColorMode();
  
  return (
      <>
        <AceEditor
          mode="javascript"
          theme={colorMode === "light" ? "solarized_light" : "monokai"}
          name="code-editor"
          value={code}
          style={{
            width:"100%",
            height: "100%",

          }}
          focus={true}
          markers={markers?.map(({ start, end }, idx) => ({
            startRow: convertCodeIndexToRowCol(code, start).row,
            startCol: convertCodeIndexToRowCol(code, start).col,
            endRow: convertCodeIndexToRowCol(code, end).row,
            endCol: convertCodeIndexToRowCol(code, end).col,
            className: `active-function-marker${getPastelIndexFor(idx)}`,
            type: 'text',
          }))}
          readOnly={locked}
          onChange={onChangeCode}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            enableMobileMenu: true,
            showLineNumbers: true,
            showGutter: true,
            highlightActiveLine: true,
            fontSize: 12,
            showPrintMargin: true,
            tabSize: 2,
            useWorker: false,
            enableMultiselect: true
          }}/>
      </>
  );
}

export default CodeEditor;