import {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { NavCreate } from "@/components/nav/nav-create";
import { Search } from "@/components/nav/search";
import { UserNav } from "@/components/nav/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { Nav } from "@/components/nav/nav";
import {CircleCheck, ClipboardList, Home, LucideIcon, Shield, Users} from 'lucide-react';
import CreateTaskDialog from "@/components/dialog/createTaskDialog";
import CreateTeamDialog from "@/components/dialog/createTeamDialog";
import CreateProjectDialog from "@/components/dialog/createProjectDialog";
import EditProfileDialog from "@/components/dialog/editProfileDialog";
import OtherProfileDialog from "@/components/dialog/otherProfileDialog ";
import CreateTaskDeleteAlertDialog from "@/components/dialog/createTaskDeleteAlertDialog";
import RightResizableSidebar from "@/components/rightSideBar/rightSideBar";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import {
  closeCreateProjectPopup,
  closeCreateTaskPopup,
  closeCreateTeamPopup,
  closeCreteTaskDeletePopup,
  closeEditProfilePopup,
  closeEditProjectMemberPopup,
  closeEditProjectNamePopup,
  closeEditTeamNamePopup,
  closeOtherUserProfilePopup,
  closeSideBarTaskInfo,
  openCreateProjectPopup,
  openCreateTeamPopup,
} from "@/store/slice/popupSlice";
import {URL_ADMIN, URL_HOME, URL_PROJECT, URL_TASKS, URL_TEAM} from "@/constants/routes/appNavigation";
import profileService from "@/services/ProfileService.ts";
import EditProjectNameDialog from "@/components/dialog/editProjectNameDialog.tsx";
import ProjectMemberDialog from "@/components/dialog/projectMembersDialog.tsx";
import EditTeamNameDialog from "@/components/dialog/editTeamNameDialog.tsx";
import adminService from "@/services/AdminService.ts";
import {useTranslation} from "react-i18next";
import i18n from "@/utils/i18n"

interface navGroup {
  title: string;
  path: string
  variant?: "default" | "ghost";
}

type Props = {
  children: React.ReactNode;
};

interface navLink {
  title: string;
  label?: string;
  icon?: LucideIcon;
  variant?: "default" | "ghost";
  path?: string;
  action?:(()=>void)|undefined
  isOpen?: boolean;
  setIsOpen?:(b:boolean)=>void
      children?:navGroup[]
}

const AuthLayout = ({ children }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const popupState = useSelector((state: RootState) => state.popup);
  const {t} = useTranslation()

  const userAdminProfile = adminService.getSelfAdminProfile()

  const navCollapsedSize = 4;

  const projectNavGrp = [] as navGroup[]
  const teamNavGrp = [] as navGroup[]

  const [isProjectOpen, setIsProjectOpen] = useState(true);
  const [isTeamOpen, setIsTeamOpen] = useState(true);

  const userInfo = profileService.getSelfUserProfile()
  const path = location.pathname.split("/");


  useEffect(() => {
    if(userInfo.userData?.data.user_app_lang) {
      i18n.changeLanguage(userInfo.userData?.data.user_app_lang)
    }

  }, [userInfo.userData]);
  
  for (const p of userInfo.userData?.data.user_projects||[]) {
    projectNavGrp.push({
      title: p.project_name,
      path: `${URL_PROJECT}/${p.project_uuid}`,
      variant: path[2] && path[2]==p.project_uuid? "default" : "ghost",
    })
  }

  for (const t of userInfo.userData?.data.user_teams||[]) {
    teamNavGrp.push({
      title: t.team_name,
      path: `${URL_TEAM}/${t.team_uuid}`,
      variant: path[2] && path[2]==t.team_uuid? "default" : "ghost",
    })
  }

  const isTabActive = (tabUrl: string) => path[1] && path[1]==tabUrl.substring(1);
  const isAdmin = userAdminProfile.data && userAdminProfile.data.data.is_admin

  const navLinks:navLink[] = [
    {
      title: t('home'),
      label: "",
      icon: Home,
      variant: isTabActive(URL_HOME) ? "default" : "ghost",
      path: "/home",
    },
    {
      title: t('myTasks'),
      label: "",
      icon: CircleCheck,
      variant: isTabActive(URL_TASKS) ? "default" : "ghost",
      path: "/tasks",
    }
  ];

  if(isAdmin) {
    navLinks.push({
      title: t('admin'),
      label: "",
      icon: Shield,
      variant: isTabActive(URL_ADMIN) ? "default" : "ghost",
      path: "/admin",
    })
  }

  const secondaryNavLinks:navLink[] = [
    {
      title: t('projects'),
      label: "972",
      icon: ClipboardList,
      variant: "ghost",
      path: "#",
      action: ()=>{dispatch(openCreateProjectPopup())},
      isOpen: isProjectOpen,
      setIsOpen: setIsProjectOpen,
      children: projectNavGrp
    },
    {
      title: t('teams'),
      label: "342",
      icon: Users,
      variant: "ghost",
      path: "#",
      action: isAdmin ? ()=>{dispatch(openCreateTeamPopup())} : undefined,
      isOpen: isTeamOpen,
      setIsOpen: setIsTeamOpen,
      children: teamNavGrp
    },
  ];

  return (
      <div className="flex flex-col">
        <TooltipProvider delayDuration={0}>
          <header className="border-b">
            <div className="flex h-16 items-center px-4">
              <NavCreate isAdmin={isAdmin||false} />
              <div className="ml-auto flex items-center space-x-4">
                <Search />
                <UserNav />
                <ModeToggle />
              </div>
            </div>
          </header>
          <ResizablePanelGroup
              direction="horizontal"
              onLayout={(sizes: number[]) => {
                document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(sizes)}`;
              }}
          >
            <ResizablePanel
                defaultSize={20}
                collapsedSize={navCollapsedSize}
                collapsible={true}
                minSize={15}
                maxSize={20}
                onCollapse={() => {
                  setIsCollapsed(true);
                  document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
                }}
                onExpand={() => {
                  setIsCollapsed(false);
                  document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
                }}
                className={cn(isCollapsed && "min-w-[0.5rem] transition-all duration-300 ease-in-out")}
            >
              <Nav isCollapsed={isCollapsed} links={navLinks} />
              <Separator />
              <Nav isCollapsed={isCollapsed} links={secondaryNavLinks} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80} minSize={30} className="min-h-[92vh]">
              {children}
            </ResizablePanel>
          </ResizablePanelGroup>

          {/* Dialog boxes */}
          <CreateTaskDialog
              setOpenState={() => dispatch(closeCreateTaskPopup())}
              dialogOpenState={popupState.createTaskDialog.isOpen}
          />
          <CreateTeamDialog
              setOpenState={() => dispatch(closeCreateTeamPopup())}
              dialogOpenState={popupState.createTeamDialog.isOpen}
          />
          <CreateProjectDialog
              setOpenState={() => dispatch(closeCreateProjectPopup())}
              dialogOpenState={popupState.createProjectDialog.isOpen}
          />
          <EditProfileDialog
              setOpenState={() => dispatch(closeEditProfilePopup())}
              dialogOpenState={popupState.editProfileDialog.isOpen}
          />
          <OtherProfileDialog
              setOpenState={() => dispatch(closeOtherUserProfilePopup())}
              dialogOpenState={popupState.otherUserProfilePopup.isOpen}
              userUUID={popupState.otherUserProfilePopup.data.userId}
          />
          <CreateTaskDeleteAlertDialog
              setOpenState={() => dispatch(closeCreteTaskDeletePopup())}
              dialogOpenState={popupState.createTaskDeleteAlertDialog.isOpen}
              taskUUID={popupState.createTaskDeleteAlertDialog.data.taskUUID}
              hasSubTasks={popupState.createTaskDeleteAlertDialog.data.hasSubTasks}
          />
          <RightResizableSidebar
              sideBarOpenState={popupState.taskInfoSideBar.isOpen}
              setOpenState={() => dispatch(closeSideBarTaskInfo())}
              taskUUID={popupState.taskInfoSideBar.data.taskId}
          />
          <EditProjectNameDialog
              dialogOpenState={popupState.editProjectNameDialog.isOpen}
              setOpenState={() => dispatch(closeEditProjectNamePopup())}
              projectId={popupState.editProjectNameDialog.data.projectId}
          />
          <ProjectMemberDialog
              dialogOpenState={popupState.editProjectMemberDialog.isOpen}
              setOpenState={() => dispatch(closeEditProjectMemberPopup())}
              projectId={popupState.editProjectMemberDialog.data.projectId}
          />
          <EditTeamNameDialog
              dialogOpenState={popupState.editTeamNameDialog.isOpen}
              setOpenState={() => dispatch(closeEditTeamNamePopup())}
              teamId={popupState.editTeamNameDialog.data.teamId}
          />
          <Toaster />
        </TooltipProvider>
      </div>
  );
};

export default AuthLayout;

