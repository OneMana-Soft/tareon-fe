import { Outlet, Navigate } from "react-router-dom";
import { URL_LOGIN } from "../constants/routes/appNavigation";
import profileService from "../services/ProfileService.ts";
import { checkRefreshCookieExists } from "@/utils/Helper.ts";
import {Loader2} from "lucide-react";

function ProtectedRoutes() {
  //   const selector = useSelector((state) => state.user);

  //   const isAuthenticated = !!(selector.id && selector.name && selector.email && selector.phoneNumber);
  // const isAuthenticated = localStorage.getItem("isAuthenticated", 'true');
  // console.log(isAuthenticated, 'is auth');

  const refreshTokenExist = checkRefreshCookieExists();
  if (!refreshTokenExist) {
    return <Navigate to={URL_LOGIN} />;
  }

  const { userData, isLoading, isError } = profileService.getSelfUserProfile();

  if (isLoading) {
    return <div className='flex justify-center items-center h-[100vh] space-x-3'><Loader2 className="size-10 animate-spin"/></div>;
  }

  return (
    // for now its accessible by hardcoading locally
    isError === undefined && userData !== undefined ? (
      <Outlet />
    ) : (
      <Navigate to={URL_LOGIN} />
    )
  );
}

export default ProtectedRoutes;
