import type { ReactNode } from "react";
import { Box, Grid, Tooltip, Typography } from "@mui/joy";

const GenericHeaderComponent = <T,>(props: {
  data: T | null;
  columnMappings: {
    label: string;
    size: number;
    mapping: (message?: T) => ReactNode;
  }[];
}) => {
  return (
    <Box
      sx={{
        color: "primary.contrastText",
        width: "calc(100% - 40px)",
        background: "var(--joy-palette-background-level2)",
        padding: "15px 20px",
        borderRadius: "10px",
        mb: "5px",
      }}
    >
      <Grid container spacing={3} justifyContent="left">
        {props.columnMappings.map((column) => (
          <Grid xs={column.size * 3} md={column.size} key={column.label}>
            <Tooltip title={column.label}>
              <Typography
                color="neutral"
                sx={{
                  userSelect: "none",
                  wordBreak: "break-all",
                  hyphens: "auto",
                }}
                lang={"de"}
              >
                {column.label}
              </Typography>
            </Tooltip>
            {!props.data ? (
              "-"
            ) : typeof column.mapping(props.data) == "string" ? (
              <Tooltip title={column.mapping(props.data)}>
                <Typography noWrap>{column.mapping(props.data)}</Typography>
              </Tooltip>
            ) : (
              column.mapping(props.data)
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GenericHeaderComponent;
