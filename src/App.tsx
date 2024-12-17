import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login/loginPage.tsx";
import {
  URL_HOME,
  URL_LOGIN,
  URL_TASKS,
  URL_PAGE_NOT_FOUND, URL_PROJECT, URL_TEAM, URL_SEARCH, URL_ADMIN,
} from "@/constants/routes/appNavigation.ts";
import "./App.css";
import ProtectedRoutes from "@/utils/ProtectedRoutes.tsx";
import HomePage from "@/pages/Home/homePage.tsx";
import AuthLayout from "@/layouts/AuthLayout.tsx";
import TaskPage from "@/pages/MyTask/myTaskPage";
import ProjectPage from "@/pages/Project/projectPage.tsx";
import TeamPage from "@/pages/Team/teamPage.tsx";
import SearchPage from "@/pages/Search/searchPage.tsx";
import NotFoundPage from "@/pages/404/404Page.tsx";
import AdminPage from "@/pages/Admin/adminPage.tsx";
import AdminRoutes from "@/utils/AdminRoutes.tsx";

function App() {
  const publicRoutes = [{ component: LoginPage, path: URL_LOGIN }, {component: NotFoundPage, path: URL_PAGE_NOT_FOUND }];
  const protectedRoutes = [
    {component: SearchPage, path: URL_SEARCH},
    { component: HomePage, path: URL_HOME },
    { component: TaskPage, path: URL_TASKS },
    {component:ProjectPage, path: URL_PROJECT +'/:projectId?'},
    {component:TeamPage, path: URL_TEAM +'/:teamId?'},
  ];
  const adminRoutes = [{ component: AdminPage, path: URL_ADMIN }];



  return (
    <main className="select-none relative bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <Routes>
        {publicRoutes.map((item) => {
          return (
            <Route
              key={item.path}
              path={item.path}
              element={<item.component />}
            />
          );
        })}

        <Route element={<ProtectedRoutes />}>
          {protectedRoutes.map((item) => {
            return (
              <Route
                key={item.path}
                path={item.path}
                element={
                  <AuthLayout>
                    <item.component />
                  </AuthLayout>
                }
              />
            );
          })}
        </Route>

        <Route element={<AdminRoutes />}>
          {adminRoutes.map((item) => {
            return (
                <Route
                    key={item.path}
                    path={item.path}
                    element={
                      <AuthLayout>
                        <item.component />
                      </AuthLayout>
                    }
                />
            );
          })}
        </Route>

        <Route
            path='*'
            element={<Navigate to={URL_PAGE_NOT_FOUND} replace />}
        />
      </Routes>
    </main>
  );
}

export default App;
