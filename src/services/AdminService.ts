import useSWR from "swr";
import axiosInstance from '../utils/AxiosInstance.ts';
import profileService from "@/services/ProfileService.ts";
import teamService from "@/services/TeamService.ts";


export interface PostgresUserInterface {
    user_uuid: string;
    user_email: string
    user_created_at: string;
    user_updated_at: string;
    user_deleted_at: string;
    is_admin?: boolean;
}

interface CreateAndUpdateAdminInterface {
    user_email?: string
    user_uuid?: string
}

interface AdminRespRaw {
    data: PostgresUserInterface
    msg: string
}

interface AdminListRespRaw {
    data: PostgresUserInterface[]
    msg: string
}

class AdminService {

    private static getAdminFetcher(url: string): Promise<AdminRespRaw> {
        return axiosInstance.get(url).then((response) => response.data);
    }

    private static getAdminListFetcher(url: string): Promise<AdminListRespRaw> {
        return axiosInstance.get(url).then((response) => response.data);
    }


    static getAllAdminList() {

        const { data, error, isLoading, mutate } = useSWR(
            `/api/admin/getAllAdminUsers`,
            AdminService.getAdminListFetcher
        );

        return {
            mutate,
            data,
            isLoading,
            isError: error,
        };
    }

    static getSelfAdminProfile() {

        const { data, error, isLoading, mutate } = useSWR(
            `/api/admin/getSelfAdminProfile`,
            AdminService.getAdminFetcher
        );

        return {
            mutate,
            data,
            isLoading,
            isError: error,
        };
    }

    static getAllUsersList() {

        const { data, error, mutate, isLoading } = useSWR(
            `/api/admin/getAllUsersList`,
            profileService.getProfileListFetcher
        );

        return {
            mutate,
            data,
            isLoading,
            isError: error,
        };
    }

    static getAllTeamsList() {

        const { data, error, mutate, isLoading } = useSWR(
            `/api/admin/getAllTeamList`,
            teamService.getTeamListFetcher
        );

        return {
            mutate,
            data,
            isLoading,
            isError: error,
        };
    }

    static createAdmin(createAdminBody: CreateAndUpdateAdminInterface) {
        return axiosInstance
            .post("/api/admin/createAdmin", createAdminBody)
            .then((res) => res);
    }

    static removeAdmin(removeAdminBody: CreateAndUpdateAdminInterface) {
        return axiosInstance
            .put("/api/admin/removeAdmin", removeAdminBody)
            .then((res) => res);
    }

    static deactivateUser(removeUserBody: CreateAndUpdateAdminInterface) {
        return axiosInstance
            .put("/api/admin/deactivateUser", removeUserBody)
            .then((res) => res);
    }

    static activateUser(removeUserBody: CreateAndUpdateAdminInterface) {
        return axiosInstance
            .put("/api/admin/activateUser", removeUserBody)
            .then((res) => res);
    }

    static deleteTeam(id: string) {
        return axiosInstance
            .delete(`/api/admin/deleteTeam/${id}`)
            .then((res) => res);
    }

    static unDeleteTeam(id: string) {
        return axiosInstance
            .put(`/api/admin/unDeleteTeam/${id}`)
            .then((res) => res);
    }

}

export default AdminService;
