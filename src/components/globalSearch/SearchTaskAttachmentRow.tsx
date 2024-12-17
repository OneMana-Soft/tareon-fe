import {

    TableCell,
} from "@/components/ui/table"
import {
    OpenSearchAttachmentInterface,

} from "@/services/SearchService.ts";
import taskService from "@/services/TaskService.ts";
import mediaService from "@/services/MediaService.ts";

interface SearchAttachmentRowInterface {
    searchAttachmentInfo ?: OpenSearchAttachmentInterface
    navigateToProject: (id: string) => void
    navigateToTeam: (id: string) => void
    openTaskInfo: (id: string) => void
    downloadFile: (id: string, fileName: string) => void
}

export function SearchTaskAttachmentRow({searchAttachmentInfo, navigateToProject, navigateToTeam, openTaskInfo, downloadFile}:SearchAttachmentRowInterface) {


    const taskInfo = taskService.getTaskInfo(searchAttachmentInfo?.attachment_task_id||'')
    const mediaObj = mediaService.getMediaURLForID(searchAttachmentInfo?.attachment_obj_key||'')


    return (
        <>
            <TableCell className="font-medium group cursor-pointer whitespace-nowrap overflow-ellipsis truncate" onClick={()=>{downloadFile(mediaObj.mediaData.url, searchAttachmentInfo?.attachment_file_name||'')}}>

                <span
                    className="group-hover:underline mr-2"
                >
                    {searchAttachmentInfo?.attachment_file_name}
                </span>

            </TableCell>

            <TableCell className="font-medium group cursor-pointer whitespace-nowrap overflow-ellipsis truncate" onClick={()=>{navigateToProject(searchAttachmentInfo?.attachment_project_id || '')}}>

                <span
                    className="group-hover:underline mr-2"
                >
                    {taskInfo.taskData?.data.task_project.project_name}
                </span>

            </TableCell>
            <TableCell className="font-medium group cursor-pointer whitespace-nowrap overflow-ellipsis truncate" onClick={()=>{openTaskInfo(searchAttachmentInfo?.attachment_task_id || '')}}>

                <span
                    className="group-hover:underline mr-2"
                >
                    {taskInfo.taskData?.data.task_name}
                </span>

            </TableCell>

            <TableCell className='w-48 whitespace-nowrap overflow-ellipsis truncate group cursor-pointer' onClick={()=>{navigateToTeam(taskInfo.taskData?.data.task_team.team_uuid || '')}}>
                <span
                    className="group-hover:underline mr-2 "
                >
                    {taskInfo.taskData?.data.task_team.team_name}

                </span>
            </TableCell>
        </>
    );
}
