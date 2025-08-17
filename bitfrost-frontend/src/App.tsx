import RouterProvider from "@/components/RouterProvider/RouterProvider.tsx";
import { Provider } from "react-redux";
import store from "./stores";
import AuthProvider from "@/components/AuthProvider/AuthProvider.tsx";
import { CssVarsProvider } from "@mui/joy";
import { SnackbarProvider } from "notistack";

const App = () => {
  return (
    <Provider store={store}>
      <CssVarsProvider />
      <SnackbarProvider
        style={{
          fontFamily: "Inter, sans-serif",
        }}
      />
      <AuthProvider>
        <RouterProvider />
      </AuthProvider>
    </Provider>
  );
};

export default App;
