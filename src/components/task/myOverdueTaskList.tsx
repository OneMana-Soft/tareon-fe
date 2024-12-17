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

export const MyOverdueTaskList = ({updateStatus}:MyCompletedTaskListProps) => {
    const [pageSize, setPageSize] = useState<number>(5);
    const [animatingTaskId, setAnimatingTaskId] = useState<string | null>(null);
    const dispatch = useDispatch();
    const queryParam = GetTaskStatusQueryParamByStatus({getAll:false, pageSize:pageSize, getOverdue:true});
    const taskInfo = taskService.getUserAssignedTaskList(queryParam);
    const {t} = useTranslation()


    const handleStatusChange = async (st: string, taskId: string, projectId: string)=>  {
        await updateStatus(st, taskId, projectId)

        await taskInfo.mutate()
    }
    const handleTaskClick = (currentStatus: string, taskId: string, projectId: string) => {
        const status = currentStatus == 'done' ? 'todo' : 'done'


        if(status == 'todo') {
            handleStatusChange(status, taskId, projectId)
            return
        }
        setAnimatingTaskId(taskId);
        setTimeout(() => {
            setAnimatingTaskId(null);
            handleStatusChange(status, taskId, projectId);

        }, 500); // Match this with the animation duration
    };

    return (
        <div className="h-52 overflow-y-auto">
            <div className='text-lg font-semibold mb-4 mt-2'>
                {`${t('overdueTask')} `}<span
                className='text-muted-foreground font-normal'>({taskInfo.taskData?.data.user_task_count || 0})</span>
            </div>
            {taskInfo.taskData?.data.user_tasks &&
                taskInfo.taskData.data.user_tasks.map((t, i) => (
                    <div
                        key={t.task_uuid}
                        className={`w-full flex-col space-y-2 hover:cursor-pointer hover:bg-primary-foreground relative overflow-hidden`}
                        onClick={() => dispatch(openSideBarTaskInfo({taskId: t.task_uuid}))}
                    >
                        <Separator orientation="horizontal" className={i ? 'invisible' : ''}/>
                        <MyTaskListTask taskInfo={t} markTaskAsCompleted={() => {
                            handleTaskClick(t.task_status, t.task_uuid, t.task_project.project_uuid)
                        }}/>
                        <Separator orientation="horizontal" className=""/>
                        {animatingTaskId === t.task_uuid && (
                            <div
                                className="absolute z-10 -top-2 m-2 inset-0 bg-gradient-to-r from-green-400 to-green-600 animate-gradient opacity-70"
                                style={{
                                    animation: 'gradientMove 0.5s ease-out forwards',
                                }}
                            />
                        )}
                    </div>
                ))
            }

            {
                taskInfo.taskData?.pageCount && taskInfo.taskData?.pageCount > 1 ?
                    <div className='capitalize text-sm hover:cursor-pointer' onClick={() => {
                        setPageSize(pageSize * 2)
                    }}>
                        {t('showMore')}
                    </div>
                    :
                    <></>
            }
        </div>
    );
};

