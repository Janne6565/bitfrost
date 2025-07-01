import { Box, Typography } from "@mui/joy";

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        flexGrow: 1,
      }}
    >
      <Typography level={"h1"} fontWeight={"lighter"}>
        404
      </Typography>
      <Typography
        level={"h2"}
        color={"neutral"}
        sx={{
          mb: 5,
        }}
      >
        The Bitfrőst was not able to reach this page
      </Typography>
    </Box>
  );
};

export default NotFoundPage;
