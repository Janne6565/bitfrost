import type { Project } from "@/@types/backendTypes.ts";
import { Box, Card, CardContent, Typography } from "@mui/joy";
import { useNavigate } from "react-router";

const ProjectBox = (props: { project: Project }) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        width: 200,
        height: "90px",
        borderRadius: 20,
        display: "flex",
        justifyContent: "flex-end",
        cursor: "pointer",
        overflow: "hidden",
        ":hover": {
          "> .MuiCardContent-root > .description": {
            opacity: 0.9,
            maxHeight: "1.5rem",
          },
        },
      }}
      onClick={() => navigate("/projects/" + props.project.projectTag)}
    >
      <CardContent
        sx={{ flexGrow: 0, justifyContent: "flex-end", pointerEvents: "none" }}
      >
        <Typography
          level={"title-md"}
          sx={{ fontSize: "1.1rem", color: "black" }}
        >
          {props.project.projectTag}
        </Typography>
        <Typography
          level={"body-md"}
          sx={{
            opacity: 0,
            maxHeight: 0,
            transition: "all ease .3s",
          }}
          className={"description"}
          color={"neutral"}
          noWrap={true}
        >
          {props.project.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ProjectsGrid = (props: { projects: Project[] }) => {
  return (
    <Box sx={{ width: "100%", display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {props.projects.map((project) => (
        <ProjectBox project={project} key={project.projectTag} />
      ))}
    </Box>
  );
};

export default ProjectsGrid;
