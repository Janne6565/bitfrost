import type { Project } from "@/@types/backendTypes";
import StatCard from "@/components/ProjectDashboard/StatCard/StatCard.tsx";
import { Grid } from "@mui/material";
import PieChartCard from "./PieChartCard/PieChartCard";
import { Box } from "@mui/joy";
import CustomizedDataGrid from "@/components/ProjectDashboard/CustomDatagrid/CustomDatagrid.tsx";

const ProjectDashboard = (props: { project: Project }) => {
  console.log(props);
  return (
    <Box
      sx={{
        height: "auto",
        display: "flex",
        gap: "10px",
        flexDirection: "column",
        pb: "2rem",
      }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ height: "100%" }}>
          <StatCard
            title={"Messages Published"}
            value={"14k"}
            interval={"Last 30 days"}
            id={"messages-send"}
            graphColor={"success"}
            data={[
              200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320,
              360, 340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480,
              460, 600, 880, 920,
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ height: "100%" }}>
          <StatCard
            title={"Messages Send"}
            value={"14k"}
            interval={"Last 30 days"}
            id={"messages-send"}
            graphColor={"success"}
            data={[
              200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320,
              360, 340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480,
              460, 600, 880, 920,
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ height: "100%" }}>
          <StatCard
            title={"Errors received"}
            id={"errors-received"}
            value={"14k"}
            interval={"Last 30 days"}
            graphColor={"warning"}
            data={[
              200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320,
              360, 340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480,
              460, 600, 880, 920,
            ]}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ height: "400px" }}>
        <Grid size={{ xs: 12, sm: 6, lg: 9 }} sx={{ height: "400px" }}>
          <CustomizedDataGrid
            columns={[
              {
                field: "messageContent",
                headerName: "Message",
                flex: 0.5,
              },
              {
                field: "publishedOn",
                headerName: "Published on",
                flex: 0.5,
              },
              {
                field: "messageJobs",
                headerName: "Count of Jobs",
                flex: 0.5,
              },
            ]}
            rows={[
              {
                id: "o1u23u123",
                messageContent: "test",
                publishedOn: 60,
                messageJobs: 10,
              },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ height: "400px" }}>
          <PieChartCard
            title={"Subscribers per Topic"}
            data={[
              { label: "user:creation", value: 1500 },
              { label: "user:deletion", value: 1500 },
              { label: "user:change", value: 500 },
              { label: "user:update", value: 2500 },
              { label: "user:notify", value: 1500 },
              { label: "user:france", value: 1500 },
              { label: "user:german", value: 3500 },
              { label: "user:denish", value: 1500 },
              { label: "user:spanish", value: 1500 },
              { label: "user:italian", value: 1500 },
              { label: "user:mutated", value: 1500 },
              { label: "user:frenched", value: 1500 },
              { label: "user:italited", value: 1500 },
              { label: "user:united", value: 1500 },
              { label: "user:seperated", value: 1500 },
              { label: "user:collected", value: 1500 },
              { label: "user:eier", value: 1500 },
            ]}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default ProjectDashboard;
