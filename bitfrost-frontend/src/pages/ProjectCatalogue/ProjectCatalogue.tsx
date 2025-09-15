import { useEffect, useState, useCallback} from "react";
import useApi from "@/hooks/useApi/useApi";
import { Input, Typography } from "@mui/joy";
import type { Project } from "@/@types/backendTypes";
import Box from "@mui/joy/Box";
import ProjectSubscribeModal from "./SubscribeToProject";
import Beam from "./Beam";
import ProjectGrid from "./ProjectGrid";
import { useTypedSelector } from "@/stores/rootReducer";

export default function ProjectCatalogue() {
  const { fetchProjects } = useApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [showBeam, setShowBeam] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


   const allSub = useTypedSelector((state) => state.subscriptionSlice)?.subscriptions;

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

  const filteredProjects = projects.filter((project) =>
  project.projectTag.toLowerCase().includes(searchTerm.toLowerCase())
);

const handleSubscribeButton = useCallback(
  (project: Project, origin: { x: number; y: number }) => {

    setSelectedProject(project);
    setOrigin(origin);
    setModalOpen(true);
    setShowBeam(true);
  },
  [] 
);

  const openDetailModal = () => {
    console.log(allSub)
  };



  return (
    <Box sx={{display: "flex",
        height: "100%",
        flexGrow: 1,
        px: "3rem",
        flexDirection: "column",}}>
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
  onSubscribe={handleSubscribeButton}
  openDetailModal={openDetailModal}
  loading={loading}
/>
         {showBeam && origin && (
      <Beam
        origin={origin}
        onAnimationEnd={() => {
          setShowBeam(false);
        }}
      />
    )}
      <ProjectSubscribeModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      project={selectedProject}
      origin={origin}
    />
    </Box>
  );
}
