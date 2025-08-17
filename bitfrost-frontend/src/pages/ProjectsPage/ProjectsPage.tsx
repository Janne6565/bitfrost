import { Box, Typography } from "@mui/joy";
import ProjectsGrid from "@/components/ProjectsGrid/ProjectsGrid.tsx";
import type { Project } from "@/@types/backendTypes.ts";
import { useTypedSelector } from "@/stores/rootReducer.ts";

const ProjectsPage = () => {
  const projects: Project[] = Object.values(
    useTypedSelector((state) => state.ownedProjectSlice.ownedProjects),
  );
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        flexGrow: 1,
        px: "3rem",
        flexDirection: "column",
      }}
    >
      <Typography level={"h1"} sx={{ mt: 5, mb: 3 }}>
        Your Projects
      </Typography>
      <ProjectsGrid projects={projects} />
    </Box>
  );
};

export default ProjectsPage;
