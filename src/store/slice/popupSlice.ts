import { createSlice } from "@reduxjs/toolkit";

interface modalEditProjectInterface {
  projectId: string;
}
interface modalEditTeamInterface {
  teamId: string;
}

interface modalUserIdDataInterface {
  userId: string;
}

interface taskDeleteAlertInterface {
  taskUUID: string;
  hasSubTasks: boolean;
}

interface sideBarTaskInfoInterface{
  taskId: string
}


const initialState = {
  createTaskDialog: { isOpen: false },
  createTeamDialog: { isOpen: false },
  createProjectDialog: { isOpen: false },
  editProjectNameDialog: { isOpen: false, data: { projectId: "" } },
  editTeamNameDialog: { isOpen: false, data: { teamId: "" } },
  editProjectMemberDialog: { isOpen: false, data: { projectId: "" } },
  otherUserProfilePopup: { isOpen: false, data: { userId: "" } },
  createChannelPopup: { isOpen: false },
  taskInfoSideBar: { isOpen: false, data: { taskId: "" } },
  createTaskDeleteAlertDialog: { isOpen: false, data: { taskUUID: "" , hasSubTasks:false} },
  alertMessagePopup: {
    isOpen: false,
    data: { msg: "", msgTitle: "", btnText: "" },
  },
  editProfileDialog: { isOpen: false},
};

export const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    openCreateTaskPopup: (state) => {
      state.createTaskDialog = {
        isOpen: true,
      };
    },

    closeCreateTaskPopup: (state) => {
      state.createTaskDialog = initialState.createTaskDialog;
    },

    openCreateTeamPopup: (state) => {
      state.createTeamDialog = {
        isOpen: true,
      };
    },

    closeCreateTeamPopup: (state) => {
      state.createTeamDialog = initialState.createTeamDialog;
    },

    openCreateProjectPopup: (state) => {
      state.createProjectDialog = {
        isOpen: true,
      };
    },

    closeCreateProjectPopup: (state) => {
      state.createProjectDialog = initialState.createProjectDialog;
    },

    closeSideBarTaskInfo: (state) => {
      state.taskInfoSideBar = initialState.taskInfoSideBar;
    },

    openSideBarTaskInfo:(
        state,
        action: { payload: sideBarTaskInfoInterface }
    ) =>{
      state.taskInfoSideBar = {
        isOpen: true,
        data: action.payload,
      }
    },

    openOtherUserProfilePopup: (
      state,
      action: { payload: modalUserIdDataInterface }
    ) => {
      state.otherUserProfilePopup = {
        isOpen: true,
        data: action.payload,
      };
    },

    closeOtherUserProfilePopup: (state) => {
      state.otherUserProfilePopup = initialState.otherUserProfilePopup;
    },

    openEditProfilePopup: (state) => {
      state.editProfileDialog = {
        isOpen: true,
      };
    },

    closeEditProfilePopup: (state) => {
      state.editProfileDialog = initialState.editProfileDialog;
    },

    openCreteTaskDeletePopup: (
        state,
        action: { payload: taskDeleteAlertInterface }
    ) => {
      state.createTaskDeleteAlertDialog = {
        isOpen: true,
        data: action.payload
      };
    },

    closeCreteTaskDeletePopup: (state) => {
      state.createTaskDeleteAlertDialog = initialState.createTaskDeleteAlertDialog;
    },

    openEditProjectNamePopup: (
        state,
        action: { payload: modalEditProjectInterface }
    ) => {
      state.editProjectNameDialog = {
        isOpen: true,
        data: action.payload,
      };
    },


    closeEditProjectNamePopup: (state) => {
      state.editProjectNameDialog = initialState.editProjectNameDialog;
    },

    openEditTeamNamePopup: (
        state,
        action: { payload: modalEditTeamInterface }
    ) => {
      state.editTeamNameDialog = {
        isOpen: true,
        data: action.payload,
      };
    },


    closeEditTeamNamePopup: (state) => {
      state.editTeamNameDialog = initialState.editTeamNameDialog;
    },

    openEditProjectMemberPopup: (
        state,
        action: { payload: modalEditProjectInterface }
    ) => {
      state.editProjectMemberDialog = {
        isOpen: true,
        data: action.payload,
      };
    },

    closeEditProjectMemberPopup: (state) => {
      state.editProjectMemberDialog = initialState.editProjectMemberDialog;
    },

  },
});

export const {
  openCreateTaskPopup,
  closeCreateTaskPopup,
  openCreateTeamPopup,
  closeCreateTeamPopup,
  openCreateProjectPopup,
  closeCreateProjectPopup,
  openEditProfilePopup,
  closeEditProfilePopup,
  closeSideBarTaskInfo,
  openSideBarTaskInfo,
  openOtherUserProfilePopup,
  closeOtherUserProfilePopup,
  openCreteTaskDeletePopup,
  closeCreteTaskDeletePopup,
  openEditProjectNamePopup,
  closeEditProjectNamePopup,
  openEditProjectMemberPopup,
  closeEditProjectMemberPopup,
  openEditTeamNamePopup,
  closeEditTeamNamePopup
} = popupSlice.actions;

export default popupSlice;
