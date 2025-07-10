import { Box, Typography } from "@mui/joy";
import { useNavigate, useParams } from "react-router";
import { ArrowBack, People } from "@mui/icons-material";
import ProjectDashboard from "@/components/ProjectDashboard/ProjectDashboard.tsx";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import { useMemo, useState } from "react";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage.tsx";
import ProjectMembersModal from "@/components/ProjectMembersModal/ProjectMembersModal.tsx";

const ProjectDetailPage = () => {
  const { projectTag } = useParams() as { projectTag: string };
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const allProjects = useTypedSelector(
    (state) => state.ownedProjectSlice.ownedProjects,
  );

  const project = useMemo(
    () => allProjects.filter((project) => project.projectTag == projectTag)[0],
    [allProjects],
  );
  if (!project) {
    return <NotFoundPage />;
  }

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
          mt: 3.5,
          display: "flex",
        }}
      >
        <Typography
          color={"neutral"}
          sx={{
            display: "flex",
            width: "fit-content",
            padding: ".4rem .5rem",
            borderRadius: 10,
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            userSelect: "none",
            transition: "background ease .3s",
            ":hover": {
              background: "rgba(0, 0, 0, 0.1)",
            },
            ":active": {
              background: "rgba(0, 0, 0, 0.15)",
            },
          }}
          onClick={() => navigate("/")}
        >
          <ArrowBack /> Back to Projects
        </Typography>

        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: 10,
            padding: ".4rem .6rem",
            border: "1px solid rgba(0, 0, 0, 0.55)",
            ml: "auto",
            cursor: "pointer",
            transition: "background ease .3s",
            userSelect: "none",
            ":active": {
              background: "rgba(0, 0, 0, 0.1)",
            },
          }}
          onClick={() => setSettingsOpen((prev) => !prev)}
        >
          <People /> Project Members
        </Typography>
      </Box>
      <Typography level={"h1"} sx={{ mt: 2.5, mb: 1 }}>
        {project?.projectTag}
      </Typography>
      <Typography level={"h3"} color={"neutral"} sx={{ mb: 3 }}>
        {project?.description}
      </Typography>
      <ProjectDashboard project={project} />
      <ProjectMembersModal
        isOpen={settingsOpen}
        setOpen={setSettingsOpen}
        project={project}
      />
    </Box>
  );
};
export default ProjectDetailPage;
