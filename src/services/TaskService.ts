import profileService, { UserProfileDataInterface } from "@/services/ProfileService.ts";
import axiosInstance from "@/utils/AxiosInstance.ts";
import useSWR from "swr";
import { AttachmentMediaReq } from "./MediaService";
import projectService, {ProjectInfoInterface} from "@/services/ProjectService.ts";
import {TeamInfoInterface} from "@/services/TeamService.ts";



export interface CommentInfoInterface {
  comment_uuid: string
  comment_html_text: string
  comment_attachments: AttachmentMediaReq[]
  comment_created_by: UserProfileDataInterface
  comment_updated_at: string
  comment_created_at: string
}


export interface CreateCommentInterface {
  task_comment_uuid?: string
  task_comment_body?: string
  task_uuid?: string
  task_comment_attachments?: AttachmentMediaReq[]
}

export interface CreateTaskInterface {
  task_uuid?: string;
  task_name?: string;
  task_status?: string;
  task_priority?: string;
  task_description?: string;
  task_due_date?: string;
  task_project_uuid?: string;
  task_assignee_uuid?: string;
  task_label?: string;
  task_start_date?: string;
  task_attachments?: AttachmentMediaReq[];
}

export interface TaskInfoInterface {
  uid: string;
  task_uuid: string;
  task_name: string;
  task_priority: string;
  task_project: ProjectInfoInterface
  task_team: TeamInfoInterface
  task_status: string;
  task_sub_tasks: TaskInfoInterface[]
  task_parent_task: TaskInfoInterface
  task_label: string;
  task_deleted_at: string;
  task_comments: CommentInfoInterface[]
  task_description: string;
  task_assignee: UserProfileDataInterface;
  task_collaborators: UserProfileDataInterface[];
  task_due_date: string;
  task_sub_task_count: number
  task_comment_count: number
  task_start_date: string;
  task_attachments: AttachmentMediaReq[]
  task_created_by: UserProfileDataInterface;
}
export interface TaskInfoRawInterface {
  data: TaskInfoInterface;
  msg: string;
}

export interface TaskInfoListRawInterface {
  data: TaskInfoInterface[];
  msg: string;
}

class TaskService {
  private static getTaskFetcher(url: string): Promise<TaskInfoRawInterface> {
    const fetcher: Promise<TaskInfoRawInterface> = axiosInstance
      .get(url)
      .then((response) => response.data);
    return fetcher;
  }



  static getUserAssignedTaskList(ulrParam: string) {
    const { data, error, isLoading, mutate } = useSWR(
        (ulrParam!='' && ulrParam != undefined ?`/api/user/assignedTaskList?${ulrParam}`:null),
        profileService.getProfileFetcher
    );

    return {
      taskData: data,
      isLoading,
      isError: error,
      mutate: mutate,
    };
  }

  static getProjectTaskList(id:string, ulrParam: string) {
    const { data, error, isLoading, mutate } = useSWR(
        (id != '' && ulrParam!='' && ulrParam != undefined ?`/api/project/taskList/${id}?${ulrParam}`:null),
        projectService.getProjectFetcher
    );

    return {
      projectData: data,
      isLoading,
      isError: error,
      mutate: mutate,
    };
  }


  static getTaskInfo(id: string) {
    const { data, error, isLoading, mutate } = useSWR(
      (id!=='' ?`/api/task/info/${id}`:null),
      TaskService.getTaskFetcher
    );

    return {
      taskData: data,
      isLoading,
      isError: error,
      mutate: mutate,
    };
  }

  static createTask(createTaskBody: CreateTaskInterface) {
    return axiosInstance
      .post("/api/task/createTask", createTaskBody)
      .then((res) => res);
  }

  static updateTaskName(updateTaskBody: CreateTaskInterface) {
    return axiosInstance
        .post("/api/task/updateTaskName", updateTaskBody)
        .then((res) => res);
  }

  static updateTaskDesc(updateTaskBody: CreateTaskInterface) {
    return axiosInstance
        .post("/api/task/updateTaskDesc", updateTaskBody)
        .then((res) => res);
  }

  static updateTaskAssignee(updateTaskBody: CreateTaskInterface) {
    return axiosInstance
        .post("/api/task/updateTaskAssignee", updateTaskBody)

  }

  static updateTaskStartDate(updateTaskBody: CreateTaskInterface) {
    return axiosInstance
        .post("/api/task/updateTaskStartDate", updateTaskBody)
        .then((res) => res);
  }

  static updateTaskDueDate(updateTaskBody: CreateTaskInterface) {
    return axiosInstance
        .post("/api/task/updateTaskDueDate", updateTaskBody)
        .then((res) => res);
  }

  static updateTaskStatus(updateTaskBody: CreateTaskInterface) {
    return axiosInstance
        .post("/api/task/updateTaskStatus", updateTaskBody)
        .then((res) => res);
  }

  static updateTaskPriority(updateTaskBody: CreateTaskInterface) {
    return axiosInstance
        .post("/api/task/updateTaskPriority", updateTaskBody)
        .then((res) => res);
  }

  static updateTaskLabel(updateTaskBody: CreateTaskInterface) {
    return axiosInstance
        .post("/api/task/updateTaskLabel", updateTaskBody)
        .then((res) => res);
  }

  static createSubTask(updateTaskBody: CreateTaskInterface) {
    return axiosInstance
        .post("/api/task/createSubTask", updateTaskBody)
        .then((res) => res);
  }

  static createTaskComment(updateTaskBody: CreateCommentInterface) {
    return axiosInstance
        .post("/api/task/createCommentTask", updateTaskBody)
        .then((res) => res);
  }

  static updateTaskComment(updateTaskBody: CreateCommentInterface) {
    return axiosInstance
        .put("/api/task/updateComment", updateTaskBody)
        .then((res) => res);
  }

  static deleteTaskComment(id: string){
    return axiosInstance
        .delete(`/api/task/deleteTaskComment/${id}`)
        .then((res) => res);
  }

  static deleteTaskAttachment(id: string){
    if(id.length == 0) return
    return axiosInstance
        .delete(`/api/task/deleteTaskAttachment/${id}`)
        .then((res) => res);
  }

  static addTaskAttachment(updateTaskBody: CreateTaskInterface) {
    return axiosInstance
        .put("/api/task/addAttachmentToTask", updateTaskBody)
        .then((res) => res);
  }

  static deleteTask(id: string){
    if(id.length == 0) return
    return axiosInstance
        .delete(`/api/task/deleteTask/${id}`)
        .then((res) => res);
  }

  static unDeleteTask(id: string){
    if(id.length == 0) return
    return axiosInstance
        .put(`/api/task/undeleteTask/${id}`)
        .then((res) => res);
  }

}

export default TaskService;
