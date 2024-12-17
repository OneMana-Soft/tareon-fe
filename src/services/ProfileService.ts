import axiosInstance from "@/utils/AxiosInstance.ts";
import useSWR from "swr";
import { TeamInfoInterface } from "@/services/TeamService.ts";
import { ProjectInfoInterface } from "@/services/ProjectService.ts";
import {TaskInfoInterface} from "@/services/TaskService.ts";
import axios from "axios";

export interface UserProfileUpdate {
  user_profile_key: string;
  user_team_name: string;
  user_job_title: string;
  user_about_me: string;
  user_app_lang: string;
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
  user_deleted_at: string;
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

  static getProfileListFetcher(
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

  static getAllUsersListSWR() {
    const { data, error, mutate, isLoading } = useSWR(
        `/api/user/allUsers`,
        ProfileService.getProfileListFetcher
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

  static usersListWhoDontBelongToTheTeam(id: string) {
    const { data, error, mutate, isLoading } = useSWR(
        id !== "" ? `/api/user/usersListWhoDontBelongToTheTeam/${id}` : null,
        ProfileService.getProfileListFetcher
    );

    return {
      userData: data,
      isLoading,
      isError: error,
      mutate,
    };
  }

  static usersListWhoDontBelongToTheProjectButBelongToTheTeam(id: string) {
    const { data, error, mutate, isLoading } = useSWR(
        id !== "" ? `/api/user/usersListWhoDontBelongToTheProjectButBelongToTheTeam/${id}` : null,
        ProfileService.getProfileListFetcher
    );

    return {
      userData: data,
      isLoading,
      isError: error,
      mutate,
    };
  }
  static logout() {
    return axios.get(`${import.meta.env.VITE_BACKEND_URL}logout`, {
      withCredentials: true
    }).then((res) => res);
  }
}

export default ProfileService;
