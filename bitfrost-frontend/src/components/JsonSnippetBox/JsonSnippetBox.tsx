import { Box } from "@mui/joy";
import { CodeBlock, CopyBlock, nord } from "react-code-blocks";

const JsonSnippetBox = (props: { content: string; copyMode?: boolean }) => {
  return (
    <Box
      className={"code-block"}
      sx={{
        "> div > span > code": {
          textWrap: "auto !important",
        },
      }}
    >
      {props.copyMode == undefined || props.copyMode ? (
        <CopyBlock
          text={props.content}
          language={"json"}
          showLineNumbers={true}
          theme={nord}
          customStyle={{
            fontSize: "14px",
            paddingRight: "50px",
          }}
          codeContainerStyle={{
            textWrap: "auto",
          }}
        />
      ) : (
        <CodeBlock
          text={props.content}
          language={"json"}
          showLineNumbers={true}
          theme={nord}
          customStyle={{
            fontSize: "14px",
            paddingRight: "50px",
            overflowX: "auto",
            fontFamily: "monospace",
          }}
          codeContainerStyle={{
            textWrap: "auto",
          }}
        />
      )}
    </Box>
  );
};

export default JsonSnippetBox;
