import React from "react";
import styled from 'styled-components';

export interface TerminalProps {
  outputs: Array<string>;
  mode: string;
}

const TopBar = styled.div`
  background-color: gray;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: 100%;
`;

const TopBarTitle = styled.div`
  width: 100%;
  text-align: center;
`;

const Title = styled.p`
  color: #ffffff;
  font-weight: bold;
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.div`
  width: 15px;
  height: 15px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  cursor: pointer;
`;

const TerminalContainer = styled.div`
  background-color: #772953;
  box-sizing: border-box;
  width: 100%;
  height: 96%;
  border-radius: 8px;
  font-family: monospace;
  overflow-y: auto;
  box-shadow: 0px 2px 4px color-mix(in srgb, black 64%, transparent),
    0px 0px 1px inset
      color-mix(in srgb, var(--chakra-colors-gray-300) 30%, transparent);
`;

const TerminalSection = styled.div`
  white-space: pre-wrap;
  overflow-wrap: break-word;
  margin: 12px;
`;

const TerminalPrompt = styled.p`
  color: #33FF00;
  margin: 2px;
`;

const PromptCommand = styled.span`
  color: white;
`;

const PromptLine = styled.p`
  margin: 0;
  color: white;
`;

const Terminal: React.FC<TerminalProps> = ({ outputs, mode }) => {

  return (
    <TerminalContainer>
      <TopBar>
        <TopBarTitle>
          <Title>user@desktop:~</Title>
        </TopBarTitle>
        <Buttons>
          <Button color="#ff605c">{" "}</Button>
          <Button color="#ffbd44">{" "}</Button>
          <Button color="#00ca4e">{" "}</Button>
        </Buttons>
      </TopBar>
      <TerminalSection>
        {mode === "visualizing" &&
          <TerminalPrompt>
            user@desktop:~{" "}<PromptCommand>node file.js</PromptCommand>
            {outputs?.map((output, index) => (
              <PromptLine key={index}>
                {output}
              </PromptLine>
            ))}
          </TerminalPrompt>
        }
      </TerminalSection>
    </TerminalContainer>
  )
}

export default Terminal;