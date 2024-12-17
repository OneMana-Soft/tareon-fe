import {
    TableCell,
} from "@/components/ui/table"
import  {OpenSearchCommentInterface, OpenSearchTaskInterface} from "@/services/SearchService.ts";
import store from "@/store/store.ts";
import taskService from "@/services/TaskService.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {priorities, statuses} from "@/components/task/data.tsx";
import {openOtherUserProfilePopup} from "@/store/slice/popupSlice.ts";
import {useTranslation} from "react-i18next";

interface SearchTaskRowInterface {
    searchTaskInfo ?: OpenSearchTaskInterface
    searchTaskCommentInfo ?: OpenSearchCommentInterface
    openTaskInfo: (id: string) => void
    navigateToProject: (id: string) => void
}

export function SearchTaskRow({searchTaskInfo, searchTaskCommentInfo, openTaskInfo, navigateToProject}:SearchTaskRowInterface) {

    const taskId = searchTaskCommentInfo?.comment_task_id || searchTaskInfo?.task_id || ''

    const taskInfo = taskService.getTaskInfo(taskId)
    const {t} = useTranslation()

    const status = statuses.find(
        (status) => status.value === taskInfo.taskData?.data.task_status
    );

    const priority = priorities.find(
        (priority) => priority.value === taskInfo.taskData?.data.task_priority
    );


    // <TableHead className='w-36 whitespace-nowrap overflow-ellipsis truncate'>Status</TableHead>
    // <TableHead
    //     className='w-32 whitespace-nowrap overflow-ellipsis truncate'>Priority</TableHead>
    // <TableHead
    //     className='w-48 whitespace-nowrap overflow-ellipsis truncate'>Project</TableHead>
    // <TableHead
    //     className='w-48 whitespace-nowrap overflow-ellipsis truncate'>Assignee</TableHead>
    return (
        <>
            <TableCell className="font-medium group cursor-pointer whitespace-nowrap overflow-ellipsis truncate" onClick={()=>{openTaskInfo(taskId)}}>
                {taskInfo.taskData?.data.task_label && <Badge variant="secondary">{taskInfo.taskData?.data.task_label}</Badge>}
                <span
                    className="group-hover:underline task-name mr-2"
                >
                    {taskInfo.taskData?.data.task_name}
                </span>

            </TableCell>
            <TableCell  className='w-36 whitespace-nowrap overflow-ellipsis truncate'>
                {status && <div className="flex w-full items-center hover: cursor-pointer" onClick={()=>{openTaskInfo(taskId)}}>
                    {status.icon && (
                        <status.icon className="mr-2 h-4 w-4 text-muted-foreground"/>
                    )}
                    <span>{t(status.label)}</span>
                </div>}
            </TableCell>
            <TableCell  className='w-32 whitespace-nowrap overflow-ellipsis truncate'>
                {priority && <div className="flex items-center w-full hover:cursor-pointer" onClick={()=>{openTaskInfo(taskId)}}>
                    {priority.icon && (
                        <priority.icon className="mr-2 h-4 w-4 text-muted-foreground"/>
                    )}
                    <span>{t(priority.label)}</span>
                </div>}
            </TableCell>
            <TableCell className='w-48 whitespace-nowrap overflow-ellipsis truncate' onClick={()=>{navigateToProject(taskInfo.taskData?.data.task_project.project_uuid||'')}}>
                <div className="flex space-x-2 cursor-pointer hover:underline">
                      {taskInfo.taskData?.data.task_project.project_name}
                </div>
            </TableCell>
            <TableCell className='w-48 whitespace-nowrap overflow-ellipsis truncate'>
                {taskInfo.taskData?.data?.task_assignee?.user_name ? <div className="flex space-x-2 group cursor-pointer" onClick={()=>{store.dispatch(openOtherUserProfilePopup({userId:taskInfo.taskData?.data?.task_assignee?.user_uuid || ''}))}}>
                    <span className="group-hover:underline">
                      {taskInfo.taskData?.data?.task_assignee?.user_name}
                    </span>
                </div>:
                    <span>{"--"}</span>}
            </TableCell>
        </>
    );
}
