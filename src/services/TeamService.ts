import {
  UserProfileDataInterface,
} from "@/services/ProfileService.ts";
import axiosInstance from "@/utils/AxiosInstance.ts";
import useSWR from "swr";
import { ProjectInfoInterface } from "@/services/ProjectService.ts";

export interface TeamInfoInterface {
  id: string
  uid: string;
  team_uuid: string;
  team_name: string;
  team_projects: ProjectInfoInterface[];
  team_is_admin: boolean;
  team_is_member: boolean;
  team_members: UserProfileDataInterface[];
  team_admins: UserProfileDataInterface[];
  team_created_by: UserProfileDataInterface;
  team_created_at: string;
  team_updated_at: string;
  team_deleted_at: string;
}

interface CreateOrUpdateTeamInfo {
  team_name?: string;
  team_uuid?: string;
  member_uuid?: string;
}

export interface TeamInfoRawInterface {
  msg: string;
  data: TeamInfoInterface;
}

export interface TeamInfoListRawInterface {
  msg: string;
  data: TeamInfoInterface[];
}

class TeamService {
  private static getTeamFetcher(url: string): Promise<TeamInfoRawInterface> {
    const fetcher: Promise<TeamInfoRawInterface> = axiosInstance
      .get(url)
      .then((response) => response.data);
    return fetcher;
  }

  static getTeamListFetcher(
    url: string
  ): Promise<TeamInfoListRawInterface> {
    const fetcher: Promise<TeamInfoListRawInterface> = axiosInstance
      .get(url)
      .then((response) => response.data);
    return fetcher;
  }

  static getTeamProjectListInfo(id: string) {
    const { data, error, isLoading, mutate } = useSWR(
        (id !='' ? `/api/team/projectList/${id}` : null),
        TeamService.getTeamFetcher
    )

    return {
      teamData: data,
      isLoading,
      isError: error,
      userMutate: mutate,
    };
  }

  static getTeamMemberListInfo(id: string) {
    const { data, error, isLoading, mutate } = useSWR(
        (id !='' ? `/api/team/membersInfo/${id}` : null),
        TeamService.getTeamFetcher
    )

    return {
      teamData: data,
      isLoading,
      isError: error,
      userMutate: mutate,
    };
  }


  static getTeamInfo(id: string) {
    const { data, error, isLoading, mutate } = useSWR(
        (id !='' ? `/api/team/info/${id}` : null),
      TeamService.getTeamFetcher
    )

    return {
      teamData: data,
      isLoading,
      isError: error,
      Mutate: mutate,
    };
  }

  static getTeamListInAdminInfo() {
    const { data, error, isLoading, mutate } = useSWR(
      `/api/team/teamListByAdminUID`,
      TeamService.getTeamListFetcher
    );

    return {
      teamData: data,
      isLoading,
      isError: error,
      mutate: mutate,
    };
  }

  static CreateTeam(createTeamBody: CreateOrUpdateTeamInfo) {
    return axiosInstance
      .post("/api/team/createTeam", createTeamBody)
      .then((res) => res);
  }

  static addTeamMember(createTeamBody: CreateOrUpdateTeamInfo) {
    return axiosInstance
        .put("/api/team/addMember", createTeamBody)
        .then((res) => res);
  }

  static addAdminTeamMember(createTeamBody: CreateOrUpdateTeamInfo) {
    return axiosInstance
        .put("/api/team/addAdminRole", createTeamBody)
        .then((res) => res);
  }

  static removeAdminRole(teamId: string, userId: string) {
    return axiosInstance
        .delete(`/api/team/removeAdminRole/${teamId}/${userId}`)
        .then((res) => res);
  }

  static removeMember(teamId: string, userId: string) {
    return axiosInstance
        .delete(`/api/team/removeMember/${teamId}/${userId}`)
        .then((res) => res);
  }

  static updateTeamName(createTeamBody: CreateOrUpdateTeamInfo) {
    return axiosInstance
        .put("/api/team/updateName", createTeamBody)
        .then((res) => res);
  }

}

export default TeamService;
