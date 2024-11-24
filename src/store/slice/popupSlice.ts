import { createSlice } from "@reduxjs/toolkit";

interface modalChannelIdDataInterface {
  channelId: string;
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
interface modalAlertMsgInterface {
  msg: string;
  msgTitle: string;
  btnText: string;
}

const initialState = {
  createTaskDialog: { isOpen: false },
  createTeamDialog: { isOpen: false },
  createProjectDialog: { isOpen: false },
  otherUserProfilePopup: { isOpen: false, data: { userId: "" } },
  createChannelPopup: { isOpen: false },
  taskInfoSideBar: { isOpen: false, data: { taskId: "" } },
  createTaskDeleteAlertDialog: { isOpen: false, data: { taskUUID: "" , hasSubTasks:false} },
  alertMessagePopup: {
    isOpen: false,
    data: { msg: "", msgTitle: "", btnText: "" },
  },
  editProfileDialog: { isOpen: false },
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
  closeCreteTaskDeletePopup
} = popupSlice.actions;

export default popupSlice;
