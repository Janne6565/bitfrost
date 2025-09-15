import { Button, Tooltip, Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import type { Project } from "@/@types/backendTypes";
import "./rainbowButton.css";
import { memo } from "react";

interface ProjectCardProps {
  project: Project;
  onSubscribe: (project: Project, origin: { x: number; y: number }) => void;
  openDetailModal: (project: Project) => void;
}

function ProjectCard({
  project,
  onSubscribe,
  openDetailModal,
}: ProjectCardProps) {
  return (
    <Card
      variant="outlined"
      key={project.projectTag}
      size="lg"
      onClick={(e) => {
        const sel = window.getSelection();
        if (sel && sel.toString().length > 0) return;
        openDetailModal(project);
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        minHeight: 100,
        p: 2,
        gap: 0.5,
        "&:hover, &:focus-within": {
          transform: "scale(1.01)",
          boxShadow: "md",
          borderColor: "neutral.outlinedHoverBorder",
        },
        "&:active:not(:has(button:active))": {
          transform: "scale(0.99)",
          boxShadow: "sm",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography level="h4" noWrap>
          {project.projectTag}
        </Typography>
        <Tooltip title="Subscribe to project" placement="top" enterDelay={800}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              onSubscribe(project, {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              });
            }}
            size="sm"
            variant="soft"
            className="rainbow-button"
          >
            sub🌈
          </Button>
        </Tooltip>
      </Box>

      <Typography level="body-sm" noWrap>
        # Topics: {project.topics.length}
      </Typography>
      <Tooltip
        title={project.description}
        placement="bottom-start"
        sx={{
          maxWidth: 240,
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
            cursor: "default",
          }}
        >
          {project.description}
        </Typography>
      </Tooltip>
    </Card>
  );
}


export default memo(ProjectCard);