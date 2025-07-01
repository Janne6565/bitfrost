import RouterProvider from "@/components/RouterProvider/RouterProvider.tsx";
import { Provider } from "react-redux";
import store from "./stores";
import AuthProvider from "@/components/AuthProvider/AuthProvider.tsx";
import { CssVarsProvider } from "@mui/joy";

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <CssVarsProvider />
        <RouterProvider />
      </AuthProvider>
    </Provider>
  );
};

export default App;
