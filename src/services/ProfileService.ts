// Uid              string           `json:"uid,omitempty"`
// DType            []string         `json:"dgraph.type,omitempty"`
// Uuid             string           `json:"user_uuid,omitempty"`
// Email            string           `json:"user_email,omitempty"`
// Name             string           `json:"user_name,omitempty"`
// Teams            []*DgraphTeam    `json:"user_teams,omitempty"`
// Project          []*DgraphProject `json:"user_project,omitempty"`
// Task             []*DgraphTask    `json:"user_tasks,omitempty"`
// SubTask          []*DgraphSubTask `json:"user_sub_task,omitempty"`
// TaskOverdueCount uint64           `json:"user_overdue_task_count,omitempty"`
// AppLang          string           `json:"user_app_lang,omitempty"`
// Profile          string           `json:"user_profile_object_key,omitempty"`
// CreatedAt        *time.Time       `json:"user_created_at,omitempty"`
// UpdatedAt        *time.Time       `json:"user_updated_at,omitempty"`
// DeletedAt        *time.Time       `json:"user_deleted_at,omitempty"`
// IsAdmin          bool             `json:"user_is_admin,omitempty"`
import axiosInstance from "@/utils/AxiosInstance.ts";
import useSWR from "swr";
import { TeamInfoInterface } from "@/services/TeamService.ts";
import { ProjectInfoInterface } from "@/services/ProjectService.ts";
import { string } from "zod";
import {TaskInfoInterface} from "@/services/TaskService.ts";

export interface UserProfileUpdate {
  user_profile_key: string;
  user_team_name: string;
  user_job_title: string;
  user_about_me: string;
}

export interface UserProfileDataInterface {
  uid: string;
  user_uuid: string;
  user_email: string;
  user_name: string;
  user_tasks: TaskInfoInterface[];
  user_task_count: number;
  user_teams: TeamInfoInterface[];
  user_projects: ProjectInfoInterface[];
  user_overdue_task_count: string;
  user_app_lang: string;
  user_profile_object_key: string;
  user_is_admin: boolean;
  user_team_name: string;
  user_job_title: string;
  user_about_me: string;
}
export interface UserProfileInterface {
  data: UserProfileDataInterface;
  pageCount?: number;
  mag: string;
}
export interface UserProfileListInterface {
  data: UserProfileDataInterface[];
  mag: string;
}

class ProfileService {
   static getProfileFetcher(url: string): Promise<UserProfileInterface> {
    const fetcher: Promise<UserProfileInterface> = axiosInstance
      .get(url)
      .then((response) => response.data);
    return fetcher;
  }

  private static getProfileListFetcher(
    url: string
  ): Promise<UserProfileListInterface> {
    const fetcher: Promise<UserProfileListInterface> = axiosInstance
      .get(url)
      .then((response) => response.data);
    return fetcher;
  }

  static getSelfUserProfile() {
    const { data, error, isLoading, mutate } = useSWR(
      `/api/user/userInfo`,
      ProfileService.getProfileFetcher
    );

    return {
      userData: data,
      isLoading,
      isError: error,
      userMutate: mutate,
    };
  }

  static getUserProfileForID(id: string) {
    const { data, error, mutate, isLoading } = useSWR(
      id !== "" ? `/api/user/info/${id}` : null,
      ProfileService.getProfileFetcher
    );

    return {
      userData: data,
      isLoading,
      isError: error,
      mutate,
    };
  }

  static getAllUsersList() {
    return axiosInstance.get("/api/user/allUsers").then((res) => res);
  }

  static UpdateProfile(updateProfileBody: UserProfileUpdate) {
    return axiosInstance
      .put("/api/user/updateProfile", updateProfileBody)
      .then((res) => res);
  }
}

export default ProfileService;
