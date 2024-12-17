import { Outlet, Navigate } from "react-router-dom";
import {URL_LOGIN, URL_PAGE_NOT_FOUND} from "../constants/routes/appNavigation";
import { checkRefreshCookieExists } from "@/utils/Helper.ts";
import {Loader2} from "lucide-react";
import AdminService from "@/services/AdminService.ts";

function ProtectedRoutes() {
  //   const selector = useSelector((state) => state.user);

  //   const isAuthenticated = !!(selector.id && selector.name && selector.email && selector.phoneNumber);
  // const isAuthenticated = localStorage.getItem("isAuthenticated", 'true');
  // console.log(isAuthenticated, 'is auth');

  const refreshTokenExist = checkRefreshCookieExists();
  if (!refreshTokenExist) {
    return <Navigate to={URL_LOGIN} />;
  }

  const selfAdminInfo = AdminService.getSelfAdminProfile()

  if (selfAdminInfo.isLoading) {
    return <div className='flex justify-center items-center h-[100vh] space-x-3'><Loader2 className="size-10 animate-spin"/></div>;
  }

  return (
    // for now its accessible by hardcoading locally
      selfAdminInfo.isError === undefined && selfAdminInfo.data?.data !== undefined ? (
      <Outlet />
    ) : (
      <Navigate to={URL_PAGE_NOT_FOUND} />
    )
  );
}

export default ProtectedRoutes;
