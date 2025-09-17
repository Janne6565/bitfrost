import { useState } from "react";
import { Input, Typography } from "@mui/joy";
import type { Project } from "@/@types/backendTypes";
import Box from "@mui/joy/Box";
import ProjectGrid from "../../components/ProjectCatalogueGrid/ProjectCatalogueGrid";
import { useTypedSelector } from "@/stores/rootReducer.ts";

export default function ProjectCatalogue() {
  const allProjects: Project[] = Object.values(
    useTypedSelector((state) => state.projectSlice.projects),
  ).sort((project1, project2) =>
    project1.projectTag.toLowerCase() > project2.projectTag.toLowerCase()
      ? 1
      : -1,
  );

  const projects = Object.values(allProjects);

  const [searchTerm, setSearchTerm] = useState("");

  const allSub = useTypedSelector(
    (state) => state.subscriptionSlice,
  )?.subscriptions;

  const filteredProjects = projects.filter((project) =>
    project.projectTag.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openDetailModal = () => {
    console.log(allSub);
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Typography level="h1">Project Catalogue</Typography>
        <Box sx={{ minWidth: 240, mt: 5, mb: 3 }}>
          <Input
            placeholder="Search by project tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 240 }}
          />
        </Box>
      </Box>
      <ProjectGrid
        projects={filteredProjects}
        openDetailModal={openDetailModal}
        loading={false}
      />
    </Box>
  );
}
