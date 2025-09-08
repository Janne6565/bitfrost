import { useOutlet } from "react-router";
import { Box, Sheet } from "@mui/joy";
import NavBar from "@/components/NavBar/NavBar.tsx";
import { useContext } from "react";
import { AuthContext } from "@/components/AuthProvider/AuthProvider.tsx";
import CustomCircularProgress from "@/components/CustomCircularProgress/CustomCircularProgress.tsx";

const Layout = () => {
  //const { isLoading } = useContext(AuthContext);
  const  isLoading  = false; // TODO: after Login Implementation, use above line again
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
        {isLoading ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              flexGrow: 1,
              alignItems: "center",
            }}
          ><CustomCircularProgress size={"lg"} />
            
          </Box>
        ) : (
          outlet
        )}
      </Box>
    </Sheet>
  );
};
export default Layout;
