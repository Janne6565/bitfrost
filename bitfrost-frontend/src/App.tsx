import RouterProvider from "@/components/RouterProvider/RouterProvider.tsx";
import AuthProvider from "@/components/AuthProvider/AuthProvider.tsx";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider />
    </AuthProvider>
  );
};

export default App;
