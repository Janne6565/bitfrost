import ProjectsPage from "@/pages/ProjectsPage/ProjectsPage.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "@/components/Layout/Layout.tsx";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage.tsx";
import ProjectDetailPage from "@/pages/ProjectDetailPage/ProjectDetailPage.tsx";

const RouterProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={"/"} element={<ProjectsPage />} />
          <Route
            path={"/projects/:projectTag"}
            element={<ProjectDetailPage />}
          />
          <Route path={"/*"} element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouterProvider;
