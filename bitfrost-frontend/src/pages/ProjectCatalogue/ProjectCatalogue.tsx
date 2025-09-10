import { Sheet, Typography } from "@mui/joy";
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
    <Sheet>
      <Typography level="h2" sx={{ marginTop: 2, marginBottom: 2 }}>
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
        {Object.entries(projects).map((project) => (
          <ProjectCard
            key={project[1].projectTag}
            project={project[1]}
            onSubscribe={onSubscribe}
            openDetailModal={openDetailModal}
          />
        ))}
      </Box>
    </Sheet>
  );
}
