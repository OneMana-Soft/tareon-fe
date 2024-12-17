"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { openSideBarTaskInfo } from "@/store/slice/popupSlice.ts";
import taskService from "@/services/TaskService";
import { GetTaskStatusQueryParamByStatus } from "@/utils/Helper.ts";
import { MyTaskListTask } from "@/components/task/myTaskListTask.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {useTranslation} from "react-i18next";

interface MyCompletedTaskListProps {
    updateStatus: (ts:string, ti: string, pi: string) => Promise<void>;
}

export const MyCompletedTaskList = ({updateStatus}:MyCompletedTaskListProps) => {
    const [pageSize, setPageSize] = useState<number>(5);
    const dispatch = useDispatch();
    const queryParam = GetTaskStatusQueryParamByStatus({getAll:false, status:'done', pageSize: pageSize, pageIndex:0});
    const taskInfo = taskService.getUserAssignedTaskList(queryParam);
    const {t} = useTranslation()

    const handleStatusChange = async (st: string, taskId: string, projectId: string)=>  {
        const status = st == 'done' ? 'todo' : 'done'
        await updateStatus(status, taskId, projectId)

        await taskInfo.mutate()
    }

    return (
        <div className="h-52 overflow-y-auto">
            <div className='text-lg font-semibold mb-4 mt-2'>
                {`${t('completedTask')} `}<span className='text-muted-foreground font-normal'>({taskInfo.taskData?.data.user_task_count||0})</span>
            </div>
            {taskInfo.taskData?.data.user_tasks &&
                taskInfo.taskData.data.user_tasks.map((t, i) => (
                    <div
                        key={t.task_uuid}
                        className={`w-full flex-col space-y-2 hover:cursor-pointer hover:bg-primary-foreground relative overflow-hidden`}
                        onClick={() => dispatch(openSideBarTaskInfo({ taskId:t.task_uuid }))}
                    >
                        <Separator orientation="horizontal" className={i ? 'invisible' : ''} />
                        <MyTaskListTask taskInfo={t} markTaskAsCompleted={()=>{handleStatusChange(t.task_status, t.task_uuid, t.task_project.project_uuid)}}/>
                        <Separator orientation="horizontal" className="" />

                    </div>
                ))
            }

            {
                taskInfo.taskData?.pageCount && taskInfo.taskData?.pageCount > 1 ?
                <div className='capitalize text-sm hover:cursor-pointer' onClick={()=>{setPageSize(pageSize*2)}}>
                    {t('showMore')}
                </div>:
                    <></>
            }
        </div>
    );
};

