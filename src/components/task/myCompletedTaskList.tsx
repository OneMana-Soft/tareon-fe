"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { openSideBarTaskInfo } from "@/store/slice/popupSlice.ts";
import taskService from "@/services/TaskService";
import { GetTaskStatusQueryParamByStatus } from "@/utils/Helper.ts";
import { MyTaskListTask } from "@/components/task/myTaskListTask.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import * as React from "react";
import {TOAST_TITLE_FAILURE, TOAST_TITLE_SUCCESS, TOAST_UNKNOWN_ERROR} from "@/constants/dailog/const.tsx";
import {useToast} from "@/hooks/use-toast.ts";

export const MyCompletedTaskList = () => {
    const [pageSize, setPageSize] = useState<number>(5);
    const [animatingTaskId, setAnimatingTaskId] = useState<string | null>(null);
    const dispatch = useDispatch();
    const queryParam = GetTaskStatusQueryParamByStatus(false, 'done', [], [], pageSize, 0);
    const taskInfo = taskService.getUserAssignedTaskList(queryParam);
    const { toast } = useToast();


    const handleUpdateTaskStatus = async (taskStatus: string, taskId: string, projectId: string)=>{
        try {
            await taskService.updateTaskStatus({task_status: taskStatus, task_uuid: taskId, task_project_uuid: projectId})

            toast({
                title: TOAST_TITLE_SUCCESS,
                description: "Updated task status",
            });

        } catch (e) {

            const errorMessage = e instanceof Error
                ? e.message
                : TOAST_UNKNOWN_ERROR;

            toast({
                title: TOAST_TITLE_FAILURE,
                description: `Failed to update task start date: ${errorMessage}`,
                variant: "destructive",
            })

            return

        }
        await taskInfo.mutate()
    }

    const handleTaskClick = async (currentStatus: string, taskId: string, projectId: string) => {
        const status = currentStatus == 'done' ? 'todo' : 'done'

        if(status == 'todo') {
            await handleUpdateTaskStatus(status, taskId, projectId)
            return
        }
        setAnimatingTaskId(taskId);
        setTimeout(() => {
            setAnimatingTaskId(null);
            handleUpdateTaskStatus(status, taskId, projectId);
        }, 500); // Match this with the animation duration
    };

    return (
        <div className="max-h-md">
            {taskInfo.taskData?.data.user_tasks &&
                taskInfo.taskData.data.user_tasks.map((t, i) => (
                    <div
                        key={t.task_uuid}
                        className={`w-full flex-col space-y-2 hover:cursor-pointer hover:bg-primary-foreground relative overflow-hidden`}
                        onClick={() => dispatch(openSideBarTaskInfo({ taskId:t.task_uuid }))}
                    >
                        <Separator orientation="horizontal" className={i ? 'invisible' : ''} />
                        <MyTaskListTask taskInfo={t} markTaskAsCompleted={()=>{handleTaskClick(t.task_status, t.task_uuid, t.task_project.project_uuid)}}/>
                        <Separator orientation="horizontal" className="" />
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
                taskInfo.taskData?.pageCount && taskInfo.taskData?.pageCount > 1 &&
                <div className='capitalize text-hs hover:cursor-pointer' onClick={()=>{setPageSize(pageSize*2)}}>
                    show more
                </div>
            }
        </div>
    );
};

