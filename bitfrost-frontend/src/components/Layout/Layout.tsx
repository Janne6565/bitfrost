import { useOutlet } from "react-router";
import { Box, Sheet } from "@mui/joy";
import NavBar from "@/components/NavBar/NavBar.tsx";

const Layout = () => {
  const outlet = useOutlet();
  return (
    <Sheet
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "97%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <NavBar />
        {outlet}
      </Box>
    </Sheet>
  );
};
export default Layout;
