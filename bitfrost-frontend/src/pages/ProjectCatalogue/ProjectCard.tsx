import { Button, Tooltip, Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import type { Project } from "@/@types/backendTypes";

interface ProjectCardProps {
  project: Project;
  onSubscribe: (project: Project) => void;
  openDetailModal: (project: Project) => void;
}

export default function ProjectCard({
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
        <Tooltip title="Subscribe to project" placement="top">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onSubscribe(project);
            }}
            size="sm"
            variant="soft"
            sx={{
              minWidth: 70,
              px: 1.5,
              fontSize: "0.75rem",
              borderRadius: "md",
              transition: "all 0.4s ease-in-out, box-shadow 0.2s",
              "&:hover": {
                background:
                  "linear-gradient(270deg, #FB3F2E, #FFB813, #2CC589, #178AEC, #9933ff, #ff33cc, #FB3F2E, #FFB813, #2CC589)",
                backgroundSize: "400% 400%",
                animation: "rainbow 4s linear infinite",
                boxShadow: "md",
                color: "#ffffff",
              },
              "@keyframes rainbow": {
                "0%": { backgroundPosition: "0% 50%" },
                "100%": { backgroundPosition: "100% 50%" },
              },
            }}
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
