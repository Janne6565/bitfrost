import { Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import ProjectCard from "./ProjectCard";
import { useTypedSelector } from "@/stores/rootReducer.ts";

export default function ProjectCatalogue() {
  const projects = useTypedSelector((state) => state.projectSlice.projects);

  const onSubscribe = () => {
    console.log("subscribe");
  };

  const openDetailModal = () => {
    console.log("details");
  };

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
      <Typography level={"h1"} sx={{ mt: 3, mb: 3 }}>
        Project Catalogue
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 2,
        }}
      >
        {Object.values(projects).map((project) => (
          <ProjectCard
            key={project.projectTag}
            project={project}
            onSubscribe={onSubscribe}
            openDetailModal={openDetailModal}
          />
        ))}
      </Box>
    </Box>
  );
}
