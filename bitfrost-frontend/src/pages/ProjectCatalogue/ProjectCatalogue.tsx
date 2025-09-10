import { useEffect, useState } from "react";
import useApi from "@/hooks/useApi/useApi";
import { Sheet, Typography } from "@mui/joy";
import type { Project } from "@/@types/backendTypes";
import Box from "@mui/joy/Box";
import ProjectCard from "./ProjectCard";
import CustomCircularProgress from "@/components/CustomCircularProgress/CustomCircularProgress.tsx";

export default function ProjectCatalogue() {
  const { fetchProjects } = useApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      const result = await fetchProjects();
      if (Array.isArray(result)) {
        setProjects(result);
      } else {
        console.warn("No Array as response");
      }
      setLoading(false);
    };

    loadProjects();
  }, [fetchProjects]);

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
        {loading ? (
          <CustomCircularProgress size={"lg"} />
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.projectTag}
              project={project}
              onSubscribe={onSubscribe}
              openDetailModal={openDetailModal}
            />
          ))
        )}
      </Box>
    </Sheet>
  );
}
