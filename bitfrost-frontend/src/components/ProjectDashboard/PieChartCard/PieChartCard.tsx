import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Box, Card, CardContent, Typography } from "@mui/joy";

interface StyledTextProps {
  variant: "primary" | "secondary";
}

const StyledText = styled("text", {
  shouldForwardProp: (prop) => prop !== "variant",
})<StyledTextProps>(({ theme }) => ({
  textAnchor: "middle",
  dominantBaseline: "central",
  fill: (theme.vars || theme).palette.text.secondary,
  variants: [
    {
      props: {
        variant: "primary",
      },
      style: {
        fontSize: theme.typography.h5.fontSize,
      },
    },
    {
      props: ({ variant }) => variant !== "primary",
      style: {
        fontSize: theme.typography.body2.fontSize,
      },
    },
    {
      props: {
        variant: "primary",
      },
      style: {
        fontWeight: theme.typography.h5.fontWeight,
      },
    },
    {
      props: ({ variant }) => variant !== "primary",
      style: {
        fontWeight: theme.typography.body2.fontWeight,
      },
    },
  ],
}));

interface PieCenterLabelProps {
  primaryText: string;
  secondaryText: string;
}

function PieCenterLabel({ primaryText, secondaryText }: PieCenterLabelProps) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;

  return (
    <React.Fragment>
      <StyledText variant="primary" x={left + width / 2} y={primaryY}>
        {primaryText}
      </StyledText>
      <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
        {secondaryText}
      </StyledText>
    </React.Fragment>
  );
}

const colors = [
  "#607D8B", // Blue Gray
  "#78909C", // Lighter Blue Gray
  "#546E7A", // Darker Blue Gray
  "#90A4AE", // Soft Slate Blue
  "#B0BEC5", // Muted Steel
  "#455A64", // Deep Slate
  "#37474F", // Charcoal Blue
  "#8FA1AE", // Misty Blue Gray
  "#AAB6BB", // Pale Grayish Blue
  "#C1CDD1", // Very Light Blue Gray
];

const getColor = (index: number) => {
  return colors[index % colors.length];
};

interface PieChartData {
  label: string;
  value: number;
}

const formatNumber = (value: number) => {
  if (value > 1000) {
    return Math.round(value / 100) / 10 + "k";
  }
  return value.toString();
};

const PieChartCard = (props: { title: string; data: PieChartData[] }) => {
  const totalValue = props.data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        height: "calc(100% - 2rem)",
        overflowY: "auto",
      }}
    >
      <CardContent>
        <Typography component="h2" level={"body-md"}>
          {props.title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PieChart
            colors={colors}
            margin={{
              left: 80,
              right: 80,
              top: 80,
              bottom: 80,
            }}
            series={[
              {
                data: props.data,
                innerRadius: 75,
                outerRadius: 100,
                paddingAngle: 0,
                highlightScope: { fade: "global", highlight: "item" },
              },
            ]}
            height={260}
            width={260}
            hideLegend
          >
            <PieCenterLabel
              primaryText={formatNumber(totalValue)}
              secondaryText="Total"
            />
          </PieChart>
        </Box>
        <Box>
          {props.data.map((data, index) => (
            <Stack
              key={index}
              direction="row"
              sx={{ alignItems: "center", gap: 2, pb: 2 }}
            >
              <Stack sx={{ gap: 1, flexGrow: 1 }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography level={"body-md"} sx={{ fontWeight: "500" }}>
                    {data.label} - {formatNumber(data.value)}
                  </Typography>
                  <Typography
                    level={"body-md"}
                    sx={{ color: "text.secondary" }}
                  >
                    {Math.round((data.value / totalValue) * 1000) / 10}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  aria-label="Number of users by country"
                  value={(data.value / totalValue) * 100}
                  sx={{
                    [`& .${linearProgressClasses.bar}`]: {
                      backgroundColor: getColor(index),
                    },
                  }}
                />
              </Stack>
            </Stack>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export { formatNumber };
export default PieChartCard;
