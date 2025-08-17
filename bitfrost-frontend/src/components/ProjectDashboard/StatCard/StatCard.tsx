import Stack from "@mui/material/Stack";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";
import { Box, Card, CardContent, Typography } from "@mui/joy";
import { useTheme } from "@mui/material";
import { formatNumber } from "@/components/ProjectDashboard/PieChartCard/PieChartCard.tsx";

export type StatCardProps = {
  title: string;
  id: string;
  value: number;
  interval: string;
  graphColor: "error" | "success" | "warning" | "primary";
  data: number[];
  xAxis: string[];
};

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function StatCard({
  title,
  value,
  id,
  interval,
  graphColor,
  data,
  xAxis,
}: StatCardProps) {
  const theme = useTheme();

  const chartColor =
    graphColor == "success"
      ? theme.palette.success.main
      : graphColor == "warning"
        ? theme.palette.warning.main
        : graphColor == "primary"
          ? theme.palette.primary.main
          : theme.palette.error.main;

  return (
    <Card
      variant="outlined"
      sx={{
        flexGrow: 1,
        borderRadius: 15,
        overflowY: "hidden",
        zIndex: 2,
      }}
    >
      <CardContent>
        <Typography
          component="h2"
          level={"title-md"}
          gutterBottom
          sx={{ mb: 0 }}
        >
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
        >
          <Stack sx={{ justifyContent: "space-between" }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography level={"h4"} component="p">
                {formatNumber(value)}
              </Typography>
            </Stack>
            <Typography level={"title-sm"} sx={{ color: "text.secondary" }}>
              {interval}
            </Typography>
          </Stack>
          <Box sx={{ width: "100%" }}>
            <SparkLineChart
              color={chartColor}
              data={data}
              area
              curve="bumpX"
              height={100}
              showHighlight
              showTooltip
              xAxis={{
                scaleType: "band",
                data: xAxis, // Use the correct property 'data' for xAxis
              }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#area-gradient-${id})`,
                },
              }}
            >
              <AreaGradient color={chartColor} id={`area-gradient-${id}`} />
            </SparkLineChart>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
