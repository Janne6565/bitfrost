import RouterProvider from "@/components/RouterProvider/RouterProvider.tsx";
import { Provider } from "react-redux";
import store from "./stores";
import AuthProvider from "@/components/AuthProvider/AuthProvider.tsx";

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider />
      </AuthProvider>
    </Provider>
  );
};

export default App;
