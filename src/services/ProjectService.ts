import {
  UserProfileDataInterface,
} from "@/services/ProfileService.ts";
import axiosInstance from "@/utils/AxiosInstance.ts";
import useSWR from "swr";
import { TaskInfoInterface } from "@/services/TaskService.ts";
import { TeamInfoInterface } from "@/services/TeamService.ts";
import {AttachmentMediaReq} from "@/services/MediaService.ts";

export interface CreateOrUpdateProjectInfo {
  project_name?: string;
  project_team_uuid?: string;
  project_attachments?: AttachmentMediaReq[]
  project_uuid?: string
  project_member_uuid?: string

}

export interface ProjectInfoInterface {
  uid: string;
  project_uuid: string;
  project_name: string;
  project_status: string;
  project_team: TeamInfoInterface;
  project_tasks: TaskInfoInterface[];
  project_attachments: AttachmentMediaReq[];
  project_task_count: number;
  project_is_admin: boolean;
  project_is_member: boolean;
  project_members: UserProfileDataInterface[];
  project_admins: UserProfileDataInterface[];
  project_created_by: UserProfileDataInterface;
  project_created_at: string;
  project_updated_at: string;
  project_deleted_at: string;
}

export interface ProjectInfoRawInterface {
  msg: string;
  pageCount?: number;
  data: ProjectInfoInterface;
}

export interface ProjectInfoListRawInterface {
  msg: string;
  data: ProjectInfoInterface[];
}

class ProjectService {
   static getProjectFetcher(
    url: string
  ): Promise<ProjectInfoRawInterface> {
    const fetcher: Promise<ProjectInfoRawInterface> = axiosInstance
      .get(url)
      .then((response) => response.data);
    return fetcher;
  }

  private static getProjectListFetcher(
    url: string
  ): Promise<ProjectInfoListRawInterface> {
    const fetcher: Promise<ProjectInfoListRawInterface> = axiosInstance
      .get(url)
      .then((response) => response.data);
    return fetcher;
  }

  static getProjectMemberInfo(id: string) {
    const { data, error, isLoading, mutate } = useSWR(
        (id != '' ?`/api/project/membersInfo/${id}`:null),
        ProjectService.getProjectFetcher
    );

    return {
      projectData: data,
      isLoading,
      isError: error,
      userMutate: mutate,
    };
  }

  static getProjectInfo(id: string) {
    const { data, error, isLoading, mutate } = useSWR(
        (id != '' ?`/api/project/info/${id}`:null),
        ProjectService.getProjectFetcher
    );

    return {
      projectData: data,
      isLoading,
      isError: error,
      Mutate: mutate,
    };
  }

  static CreateProject(createProjectBody: CreateOrUpdateProjectInfo) {
    return axiosInstance
      .post("/api/project/createProject", createProjectBody)
      .then((res) => res);
  }

  static getTeamListInAdminInfo() {
    const { data, error, isLoading, mutate } = useSWR(
      `/api/project/projectListByAdminUID`,
      ProjectService.getProjectListFetcher
    );

    return {
      projectData: data,
      isLoading,
      isError: error,
      Mutate: mutate,
    };
  }

  static DeleteProject(id: string) {
    return axiosInstance
        .delete(`/api/project/deleteProject/${id}`)
        .then((res) => res);
  }

  static UnDeleteProject(id: string) {
    return axiosInstance
        .put(`/api/project/unDeleteProject/${id}`)
        .then((res) => res);
  }

  static AddAttachment(createProjectBody: CreateOrUpdateProjectInfo) {
    return axiosInstance
        .post("/api/project/addAttachment", createProjectBody)
        .then((res) => res);
  }

  static getProjectAttachmentList(id: string) {
    const { data, error, isLoading, mutate } = useSWR(
        (id != '' ?`/api/project/attachments/${id}`:null),
        ProjectService.getProjectFetcher
    );

    return {
      projectData: data,
      isLoading,
      isError: error,
      Mutate: mutate,
    };
  }

  static RemoveAttachment(id: string) {
    return axiosInstance
        .delete(`/api/project/removeAttachment/${id}`)
        .then((res) => res);
  }

  static UpdateProjectName(createProjectBody: CreateOrUpdateProjectInfo) {
    return axiosInstance
        .put("/api/project/updateName", createProjectBody)
        .then((res) => res);
  }

  static getProjectMemberList(id: string) {
    const { data, error, isLoading, mutate } = useSWR(
        (id != '' ?`/api/project/memberWithAdminFlag/${id}`:null),
        ProjectService.getProjectFetcher
    );

    return {
      projectData: data,
      isLoading,
      isError: error,
      Mutate: mutate,
    };
  }

  static AddAdminRole(updateProjectBody: CreateOrUpdateProjectInfo) {
    return axiosInstance
        .put("/api/project/updateName", updateProjectBody)
        .then((res) => res);
  }

  static AddMember(updateProjectBody: CreateOrUpdateProjectInfo) {
    return axiosInstance
        .put("/api/project/addMember", updateProjectBody)
        .then((res) => res);
  }

  static RemoveMember(id: string, userId: string) {
    return axiosInstance
        .delete(`/api/project/removeMember/${id}/${userId}`)
        .then((res) => res);
  }

  static RemoveAdmin(id: string, userId: string) {
    return axiosInstance
        .delete(`/api/project/removeAdminRole/${id}/${userId}`)
        .then((res) => res);
  }

}

export default ProjectService;
