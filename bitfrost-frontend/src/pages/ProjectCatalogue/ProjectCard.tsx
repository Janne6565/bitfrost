import { Typography, Button, Tooltip } from "@mui/joy";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import type { Project } from "@/@types/backendTypes";

type ProjectCardProps = {
  project: Project;
  onSubscribe?: (project: Project) => void;
};

export default function ProjectCard({ project, onSubscribe }: ProjectCardProps) {
  return (
     <Card
  variant="outlined"
  key={project.projectTag}
  size="lg"
  sx={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    minHeight: 100,
    p: 2,
    gap: 0.5,              
    '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder', transform: 'scale(1.01)' },
    
  }}
>
<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Typography level="h3" noWrap>
      {project.projectTag}
    </Typography>
    <Tooltip title="Subscribe to project" placement="top">
  <Button
    onClick={() => onSubscribe}
    size="sm"
    variant="soft"
    sx={{
      minWidth: 32,
      px: 1.5,
      fontSize: '0.75rem',
      borderRadius: 'md',
    }}
  >
    sub
  </Button>
</Tooltip>
  </Box>

  <Typography level="body-sm" noWrap>
    # Topics: {project.topics.length}
  </Typography>
  <Tooltip title={project.description} placement="bottom-start" sx={{ maxWidth: 240, // ← begrenzt die Breite
    whiteSpace: 'normal', // ← erlaubt Zeilenumbruch
    wordWrap: 'break-word'}}>
  <Typography
    level="body-sm"
    sx={{
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "normal",
      cursor: "default", // optional: zeigt, dass es kein klickbares Element ist
    }}
  >
    {project.description}
  </Typography>
</Tooltip>
</Card>
  );
}
