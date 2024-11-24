// Uid         string              `json:"uid,omitempty"`
// DType       []string            `json:"dgraph.type,omitempty"`
// Uuid        string              `json:"project_uuid,omitempty"`
// Name        string              `json:"project_name,omitempty"`
// Status      string              `json:"project_status,omitempty"`
// Tasks       []*DgraphTask       `json:"project_tasks,omitempty"`
// Attachments []*DgraphAttachment `json:"project_attachments,omitempty"`
// Team        *DgraphTeam         `json:"project_team,omitempty"`
// Members     []*DgraphUser       `json:"project_members,omitempty"`
// Admins      []*DgraphUser       `json:"project_admins,omitempty"`
// CreatedBy   *DgraphUser         `json:"project_created_by,omitempty"`
// CreatedAt   *time.Time          `json:"project_created_at,omitempty"`
// UpdatedAt   *time.Time          `json:"project_updated_at,omitempty"`
// DeletedAt   *time.Time          `json:"project_deleted_at,omitempty"`

import {
  UserProfileDataInterface,
  UserProfileInterface,
} from "@/services/ProfileService.ts";
import axiosInstance from "@/utils/AxiosInstance.ts";
import useSWR from "swr";
import { TaskInfoInterface } from "@/services/TaskService.ts";
import { TeamInfoInterface } from "@/services/TeamService.ts";

export interface CreateOrUpdateProjectInfo {
  project_name?: string;
  project_team_uuid?: string;
}

export interface ProjectInfoInterface {
  uid: string;
  project_uuid: string;
  project_name: string;
  project_status: string;
  project_team: TeamInfoInterface;
  project_tasks: TaskInfoInterface[];
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
  data: ProjectInfoInterface;
}

export interface ProjectInfoListRawInterface {
  msg: string;
  data: ProjectInfoInterface[];
}

class ProjectService {
  private static getProjectFetcher(
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

  static getBasicSelfUserProfile() {
    const { data, error, isLoading, mutate } = useSWR(
      `/api/projectInfo`,
      ProjectService.getProjectFetcher
    );

    return {
      userData: data,
      isLoading,
      isError: error,
      userMutate: mutate,
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
}

export default ProjectService;
