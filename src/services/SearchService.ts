import useSWR from "swr";
import axiosInstance from '../utils/AxiosInstance.ts';


export interface OpenSearchTaskInterface {
    task_id: string;
    task_name: string;
    task_desc: string;
    task_assignee_user_id: string;
    task_project_id: string;
}

export interface OpenSearchProjectInterface {
    project_id: string;
    project_name: string;
    project_team_id: string;
}


export interface OpenSearchCommentInterface {
    comment_task_id: string
    comment_task_assignee_id: string
    comment_task_project_id: string
}


export interface OpenSearchAttachmentInterface {
    attachment_file_name: string
    attachment_obj_key: string
    attachment_by_user_id: string
    attachment_task_id: string
    attachment_project_id:  string
}

export interface OpenSearchUserInterface {
    user_id: string
    user_name: string
    user_email: string
}


interface GlobalSearchResp {
    user: OpenSearchUserInterface
    task: OpenSearchTaskInterface
    project: OpenSearchProjectInterface
    comment: OpenSearchCommentInterface
    attachment: OpenSearchAttachmentInterface
}

interface GlobalSearchRespRaw {
    data: GlobalSearchResp[]
    msg: string
    pageCount: number
}

class SearchService {

    private static getSearchFetcher(url: string): Promise<GlobalSearchRespRaw > {
        return axiosInstance.get(url).then((response) => response.data);
    }


    static getTaskAndCommentsFromSearch(id: string) {

        const { data, error, isLoading } = useSWR(
            (id!=='' ?`/api/search/taskAndComments?${id}`:null),
            SearchService.getSearchFetcher
        );

        return {
            data,
            isLoading,
            isError: error,
        };
    }

    static getProjectsFromSearch(id: string) {

        const { data, error, isLoading } = useSWR(
            (id!=='' ?`/api/search/projects?${id}`:null),
            SearchService.getSearchFetcher
        );

        return {
            data,
            isLoading,
            isError: error,
        };
    }

    static getUsersFromSearch(id: string) {

        const { data, error, isLoading } = useSWR(
            (id!=='' ?`/api/search/users?${id}`:null),
            SearchService.getSearchFetcher
        );

        return {
            data,
            isLoading,
            isError: error,
        };
    }

    static getAttachmentsFromSearch(id: string) {

        const { data, error, isLoading } = useSWR(
            (id!=='' ?`/api/search/attachments?${id}`:null),
            SearchService.getSearchFetcher
        );

        return {
            data,
            isLoading,
            isError: error,
        };
    }

}

export default SearchService;
