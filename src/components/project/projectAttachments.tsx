import { Plus, X} from "lucide-react"

import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import mediaService, {ATTACHMMENT_UPLOAD_FOR_ALL_PROJECT, UploadFileInterfaceRes} from "@/services/MediaService.ts";
import {
    addProjectAttachmentPreviewFiles,
    addProjectAttachmentUploadedFiles,
    clearProjectAttachmentInputState,
    deleteProjectAttachmentPreviewFiles, removeProjectAttachmentUploadedFiles,
    updateProjectAttachmentPreviewFiles
} from "@/store/slice/projectAttachmentSlice.ts";
import {RootState} from "@/store/store.ts";
import { TOAST_UNKNOWN_ERROR} from "@/constants/dailog/const.tsx";
import projectService from "@/services/ProjectService.ts";
import {useToast} from "@/hooks/use-toast.ts";
import {useEffect} from "react";
import AttachmentIcon from "@/components/attachmentIcon/attachmentIcon.tsx";
import ProjectAttachment from "@/components/project/projectAttachment.tsx";
import {useTranslation} from "react-i18next";


interface ProjectAttachmentsProps {
    projectId: string;
}
export function ProjectAttachments({projectId}: ProjectAttachmentsProps) {

    const dispatch = useDispatch()
    const {toast} = useToast()
    const {t} = useTranslation()

    const projectAttachmentList = projectService.getProjectAttachmentList(projectId)
    const projectInputState = useSelector(
        (state: RootState) => state.projectAttachment.projectAttachmentInputState
    );

    useEffect(() => {

        if(projectInputState[projectId] && projectInputState[projectId].filesPreview.length == projectInputState[projectId].filesUploaded.length) {
            addAttachmentsToProject()

        }

    }, [projectInputState]);

    const addAttachmentsToProject = async () => {
        try {
            // Get the latest state
            const currentProjectAttachmentState = projectInputState[projectId];

            if (!currentProjectAttachmentState || !currentProjectAttachmentState.filesUploaded || currentProjectAttachmentState.filesUploaded.length === 0) {
                return;
            }

            const projectAttachments = currentProjectAttachmentState.filesUploaded.map(attach => ({
                attachment_file_name: attach.fileName,
                attachment_obj_key: attach.url,
                attachment_uuid: ''
            }));

            await projectService.AddAttachment({
                project_uuid: projectId,
                project_attachments: projectAttachments
            });

            toast({
                title: t('success'),
                description: t('addAttachmentToProject', {count: projectAttachments.length})
            });

            dispatch(clearProjectAttachmentInputState({projectUUID: projectId}));

            await projectAttachmentList.Mutate()

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
            toast({
                title: t('failure'),
                description: `${t('failedToAddAttachmentToProject')}: ${errorMessage}`,
                variant: "destructive",
            });
        }
    };



    const handleTaskFileUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = e.target.files;
        if (!files) return;

        const uploadPromises: Promise<AxiosResponse<UploadFileInterfaceRes>>[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const cancelToken = axios.CancelToken.source();
            const uniqueNum = Date.now() + i; // Added i to prevent duplicate keys

            dispatch(
                addProjectAttachmentPreviewFiles({
                    fileUploaded: {
                        key: uniqueNum,
                        fileName: file.name,
                        progress: 0,
                        cancelSource: cancelToken,
                    },
                    projectUUID: projectId,
                })
            );

            const config: AxiosRequestConfig = {
                cancelToken: cancelToken.token,
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / (progressEvent.total || 100)) * 100
                    );

                    dispatch(
                        updateProjectAttachmentPreviewFiles({
                            progress: progress,
                            key: uniqueNum,
                            projectUUID: projectId,
                        })
                    );
                },
            };

            const uploadPromise = mediaService
                .uploadMedia(
                    file,
                    projectId || ATTACHMMENT_UPLOAD_FOR_ALL_PROJECT,
                    config
                )
                .then((res) => {
                    const uploadMediaRes: UploadFileInterfaceRes = res.data;

                    dispatch(
                        addProjectAttachmentUploadedFiles({
                            filesUploaded: {
                                fileName: file.name,
                                key: uniqueNum,
                                url: uploadMediaRes.object_name,
                            },
                            projectUUID: projectId,
                        })
                    );
                    return res;
                })
                .catch((error) => {
                    dispatch(
                        deleteProjectAttachmentPreviewFiles({
                            key: uniqueNum,
                            projectUUID: projectId,
                        })
                    );
                    console.error("error while uploading file: ", file.name, error);
                    throw error; // Re-throw to be caught by Promise.allSettled
                });

            uploadPromises.push(uploadPromise);
        }

        // Wait for all uploads to complete (success or failure)
        try {
            await Promise.allSettled(uploadPromises);
        } catch (error) {
            console.error("Error in upload batch:", error);
        }
    };

    const removeProjectPreviewFile = (key: number) => {
        dispatch(
            deleteProjectAttachmentPreviewFiles({
                key,
                projectUUID: projectId
            })
        );
        dispatch(
            removeProjectAttachmentUploadedFiles({
                key,
                projectUUID: projectId
            })
        );
    }

    const handleDelete = async (id: string) => {

        if(!id) return

        try {

            await projectService.RemoveAttachment(id||'')
            toast({
                title: t('success'),
                description: t('removedAttachment'),
            })

            await  projectAttachmentList.Mutate()

        } catch (e) {

            const errorMessage = e instanceof Error
                ? e.message
                : TOAST_UNKNOWN_ERROR;

            toast({
                title: t('failure'),
                description: `${t('failedToRemoveAttachment')} : ${errorMessage}`,
                variant: "destructive",
            })

            return
        }

    }





    return (
        <div>
            <div className="flex flex-wrap mb-4 items-center">
                {projectAttachmentList.projectData?.data.project_attachments &&
                    projectAttachmentList.projectData?.data.project_attachments.map(
                        (file) => {
                            return (
                                <div key={file.attachment_uuid}>

                                    <ProjectAttachment attachmentInfo={file} isAdmin={projectAttachmentList.projectData?.data.project_is_admin || false} handleRemoveAttachment={handleDelete}/>
                                </div>
                            );
                        }
                    )}
                {projectInputState[projectId]?.filesPreview &&
                    projectInputState[projectId].filesPreview.map(
                        (file) => {
                            return (
                                <div
                                    key={file.key}
                                    className="flex relative justify-center items-center m-1 mt-2 p-1 border rounded-xl border-gray-700"
                                >
                                    <button
                                        className="absolute top-0 right-0 p-1 -mt-2 -mr-2 bg-background rounded-full border-gray-700 border"
                                        onClick={() => removeProjectPreviewFile(file.key)}
                                    >
                                        <X height="1rem" width="1rem"/>
                                    </button>
                                    <div>
                                        <AttachmentIcon fileName={file.fileName}/>
                                    </div>
                                    <div className="flex-col">
                                        <div className="text-ellipsis truncate max-w-40 text-xs ">
                                            {file.fileName}
                                        </div>
                                        <div className="text-ellipsis truncate max-w-40 text-xs ">
                                            uploading: {file.progress}%
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    )}

                {projectAttachmentList.projectData?.data.project_is_admin && <div>
                    <Label htmlFor="project-file-upload" className="cursor-pointer">
                        <div
                            className="p-7 h-8 w-8 border-dashed bg-background rounded-2xl border-2 text-muted-foreground flex justify-center items-center ">
                            <div>
                                <Plus size='30'/>

                            </div>
                        </div>
                    </Label>

                    <Input
                        type="file"
                        key={
                            (projectInputState[projectId] &&
                                projectInputState[projectId].filesPreview
                                    .length) ||
                            0
                        }
                        id="project-file-upload"
                        multiple
                        onChange={handleTaskFileUpload}
                        style={{display: "none"}}
                    />
                </div>}
            </div>


        </div>
    )
}
