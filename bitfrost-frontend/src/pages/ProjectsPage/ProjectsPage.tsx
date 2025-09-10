import { Box, Typography } from "@mui/joy";
import ProjectsGrid from "@/components/ProjectsGrid/ProjectsGrid.tsx";
import type { Project } from "@/@types/backendTypes.ts";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import ProjectCreationButton from "@/components/ProjectCreationButton/ProjectCreationButton.tsx";
import Stack from "@mui/joy/Stack";

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
      <Stack
        className={"headline"}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography level={"h1"} sx={{ mt: 5, mb: 3 }}>
          Your Projects
        </Typography>
        <ProjectCreationButton sx={{ height: "50px" }} />
      </Stack>
      <ProjectsGrid projects={projects} />
    </Box>
  );
};

export default ProjectsPage;
