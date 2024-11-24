// Uid       string           `json:"uid,omitempty"`
// DType     []string         `json:"dgraph.type,omitempty"`
// Uuid      string           `json:"team_uuid,omitempty"`
// Projects  []*DgraphProject `json:"team_projects,omitempty"`
// Name      string           `json:"team_name,omitempty"`
// Members   []*DgraphUser    `json:"team_members,omitempty"`
// Admins    []*DgraphUser    `json:"team_admins,omitempty"`
// CreatedBy *DgraphUser      `json:"team_created_by,omitempty"`
// CreatedAt *time.Time       `json:"team_created_at,omitempty"`
// UpdatedAt *time.Time       `json:"team_updated_at,omitempty"`
// DeletedAt *time.Time       `json:"team_deleted_at,omitempty"`

import {
  UserProfileDataInterface,
  UserProfileInterface,
} from "@/services/ProfileService.ts";
import axiosInstance from "@/utils/AxiosInstance.ts";
import useSWR from "swr";
import { ProjectInfoInterface } from "@/services/ProjectService.ts";

export interface TeamInfoInterface {
  uid: string;
  team_uuid: string;
  team_name: string;
  team_projects: ProjectInfoInterface[];
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

  private static getTeamListFetcher(
    url: string
  ): Promise<TeamInfoListRawInterface> {
    const fetcher: Promise<TeamInfoListRawInterface> = axiosInstance
      .get(url)
      .then((response) => response.data);
    return fetcher;
  }

  static getTeamInfo() {
    const { data, error, isLoading, mutate } = useSWR(
      `/api/teamInfo`,
      TeamService.getTeamFetcher
    );

    return {
      userData: data,
      isLoading,
      isError: error,
      userMutate: mutate,
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
}

export default TeamService;
