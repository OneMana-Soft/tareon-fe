import useSWR from "swr";
import  {AxiosRequestConfig} from 'axios';
import axiosInstance from '../utils/AxiosInstance.ts';


export const ATTACHMMENT_UPLOAD_FOR_ALL_PROJECT = "all"

export interface UploadFileInterfaceRes {
  msg: string,
  object_name: string,
}

export interface GetMediaURLRes {
  msg: string
  url: string
}
export interface AttachmentMediaReq {
  attachment_uuid: string
  attachment_file_name: string
  attachment_obj_key ?: string
}


class MediaService {

  private static getMediaURLFetcher(url: string) {
    return axiosInstance.get(url).then((response) => response.data);
  }

  static uploadMedia(file: File, projectUUID: string, config: AxiosRequestConfig ={}) {

    const formData = new FormData();
    formData.append('file', file);

    const jsonData = JSON.stringify({ 'project_uuid': projectUUID });
    formData.append('jsonData', jsonData);

    return axiosInstance.post('/api/user/uploadFile', formData, config).then((res) => res);
  }


  static getMediaURLForID(id: string) {

    const { data, error, isLoading } = useSWR(
      (id!=='' ?`/api/user/getFile/${id}`:null),
      MediaService.getMediaURLFetcher, { refreshInterval: 5*60*1000, revalidateOnFocus: false}
    );

    const resData: GetMediaURLRes = data

    return {
      mediaData: resData,
      isLoading,
      isError: error,
    };
  }
}

export default MediaService;
