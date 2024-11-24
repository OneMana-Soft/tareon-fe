import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login/loginPage.tsx";
import {
  URL_HOME,
  URL_LOGIN,
  URL_TASKS,
  URL_PAGE_NOT_FOUND,
} from "@/constants/routes/appNavigation.ts";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form";
import "./App.css";
import ProtectedRoutes from "@/utils/ProtectedRoutes.tsx";
import HomePage from "@/pages/Home/homePage.tsx";
import AuthLayout from "@/layouts/AuthLayout.tsx";
import TaskPage from "@/pages/MyTask/myTaskPage";

function App() {
  const publicRoutes = [{ component: LoginPage, path: URL_LOGIN }];
  const protectedRoutes = [
    { component: HomePage, path: URL_HOME },
    { component: TaskPage, path: URL_TASKS },
  ];

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
        {/*<Route*/}
        {/*    path='*'*/}
        {/*    element={<Navigate to={URL_PAGE_NOT_FOUND} replace />}*/}
        {/*/>*/}
      </Routes>
    </main>
  );
}

export default App;
