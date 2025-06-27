import { Box, Typography } from "@mui/joy";
import ProjectsGrid from "@/components/ProjectsGrid/ProjectsGrid.tsx";
import type { Project } from "@/@types/backendTypes";

const ProjectsPage = () => {
  const projects: Project[] = [
    {
      projectTag: "User-Service",
      description:
        "The User Management Service - Build to create and manage users",
      topics: [
        {
          uuid: "aksjklsdja-asdasjdka-123213asdasd--asda",
          label: "user:creation",
          description: "User creation events",
        },
      ],
    },
  ];
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
      <ProjectsGrid projects={[...projects, ...projects, ...projects]} />
    </Box>
  );
};

export default ProjectsPage;
