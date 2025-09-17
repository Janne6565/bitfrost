import { Tooltip, Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import type { Project } from "@/@types/backendTypes";
import "../SubscribeToProjectModal/rainbowButton.css";
import { memo, useState } from "react";
import ProjectDetailModal from "@/components/ProjectDetailModal/ProjectDetailModal.tsx";

interface ProjectCardProps {
  project: Project;
  openDetailModal: (project: Project) => void;
}

function ProjectCard({ project, openDetailModal }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Card
        variant="outlined"
        key={project.projectTag}
        size="lg"
        onClick={() => {
          const sel = window.getSelection();
          if (sel && sel.toString().length > 0) return;
          openDetailModal(project);
          setIsModalOpen(true);
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          minHeight: 100,
          maxWidth: "250px",
          p: 2,
          transition: "all 0.4s ease-in-out, box-shadow 0.2s",
          cursor: "pointer",
          gap: 0.5,
          "&:hover": {
            transform: "scale(1.01)",
            boxShadow: "md",
            borderColor: "neutral.outlinedHoverBorder",
          },
          "&:active:not(:has(button:active))": {
            transform: "scale(1.02)",
            boxShadow: "sm",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minWidth: "225px",
            width: "100%",
          }}
        >
          <Tooltip title={project.projectTag}>
            <Typography level="h4" noWrap sx={{ pr: "1rem" }}>
              {project.projectTag}
            </Typography>
          </Tooltip>
        </Box>

        <Typography level="body-sm" noWrap>
          # Topics: {project.topics.length}
        </Typography>
        <Tooltip
          title={project.description}
          placement="bottom-start"
          sx={{
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
          enterDelay={800}
        >
          <Typography
            level="body-sm"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal",
              userSelect: "none",
            }}
            noWrap
          >
            {project.description}
          </Typography>
        </Tooltip>
      </Card>

      <ProjectDetailModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        project={project}
      />
    </>
  );
}

export default memo(ProjectCard);
