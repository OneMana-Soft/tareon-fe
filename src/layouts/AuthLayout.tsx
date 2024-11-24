import { useState } from "react";
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
import { CircleCheck, ClipboardList, Home, MessageCircle, Users } from 'lucide-react';
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
  closeSideBarTaskInfo,
} from "@/store/slice/popupSlice";
import { URL_HOME, URL_TASKS } from "@/constants/routes/appNavigation";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const popupState = useSelector((state: RootState) => state.popup);

  const navCollapsedSize = 4;

  const isTabActive = (tabUrl: string) => location.pathname.startsWith(tabUrl);

  const navLinks = [
    {
      title: "Home",
      label: "",
      icon: Home,
      variant: isTabActive(URL_HOME) ? "default" : "ghost",
      path: "/home",
    },
    {
      title: "My Tasks",
      label: "9",
      icon: CircleCheck,
      variant: isTabActive(URL_TASKS) ? "default" : "ghost",
      path: "/tasks",
    },
    {
      title: "Messages",
      label: "",
      icon: MessageCircle,
      variant: "ghost",
      path: "#",
    },
  ];

  const secondaryNavLinks = [
    {
      title: "Projects",
      label: "972",
      icon: ClipboardList,
      variant: "ghost",
      path: "#",
    },
    {
      title: "Teams",
      label: "342",
      icon: Users,
      variant: "ghost",
      path: "#",
    },
  ];

  return (
      <div className="flex flex-col">
        <TooltipProvider delayDuration={0}>
          <header className="border-b">
            <div className="flex h-16 items-center px-4">
              <NavCreate />
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
              setOpenState={() => dispatch(closeEditProfilePopup())}
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
          <Toaster />
        </TooltipProvider>
      </div>
  );
};

export default AuthLayout;

