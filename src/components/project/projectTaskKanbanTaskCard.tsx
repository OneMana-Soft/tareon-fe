import React, {useCallback} from 'react';
import { useDraggable } from '@dnd-kit/core';
import { TaskInfoInterface } from "@/services/TaskService.ts";
import {isZeroEpoch, removeHtmlTags} from "@/utils/Helper.ts";
import {GitBranch, MessageSquare, Pencil} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {useDispatch} from "react-redux";
import {openSideBarTaskInfo} from "@/store/slice/popupSlice.ts";
import {format} from "date-fns";
import {priorities} from "@/components/task/data.tsx";
import {useTranslation} from "react-i18next";

type TaskCardProps = {
    task: TaskInfoInterface;
};

export function ProjectTaskCard({ task}: TaskCardProps) {

    const dispatch = useDispatch();
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.task_uuid,
        data: task
    });
    const {t} = useTranslation()

    const taskP = priorities.find((p)=> p.value == task.task_priority)


    const style = transform
        ? {
            transform: `translate(${transform.x}px, ${transform.y}px)`,
        }
        : undefined;

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(openSideBarTaskInfo({taskId:task.task_uuid}))
    },[task]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="cursor-grab group rounded-lg bg-background p-4 shadow-sm hover:shadow-md border pointer-events-auto"
        >
            <div {...attributes} {...listeners} className="pointer-events-auto cursor-grab">
                <div className="flex cursor-grab pointer-events-none justify-between font-medium capitalize">
                    <div className="pointer-events-auto cursor-grab">{task.task_name}<span className='text-muted-foreground font-normal text-sm'>{" · "}{taskP && <taskP.icon className='inline'/>}</span></div>
                    <div className="pointer-events-auto">
                        <Button
                            size='icon'
                            variant='outline'
                            onClick={handleClick}
                            className='invisible group-hover:visible pointer-events-auto'
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <Pencil/>
                        </Button>
                    </div>
                </div>
                {task.task_description && <p className="pt-2 text-sm overflow-ellipsis cursor-grab pointer-events-auto truncated-text">
                    {removeHtmlTags(task.task_description )}
                </p>}

                <div className='flex justify-between'>
                    <div>
                        {!isZeroEpoch(task.task_due_date) && (
                            <p
                                className={`pt-1 text-xs overflow-ellipsis cursor-grab pointer-events-auto font-normal ${
                                    new Date(task.task_due_date) < new Date() ? 'text-destructive' : ''
                                }`}
                            >
                                {format(new Date(task.task_due_date), 'dd MMM yyyy')}
                            </p>
                        )}
                        {
                            task.task_assignee &&
                            <p
                                className='pt-1 text-xs overflow-ellipsis cursor-grab pointer-events-auto font-normal'
                            >
                                {t('assignee')}: <span>{task.task_assignee.user_name}</span>
                            </p>
                        }

                    </div>

                    <div className="flex space-x-3">
                        {task.task_comment_count && <span className='text-muted-foreground text-sm'>{task.task_comment_count}<MessageSquare className='h-3 w-3 inline ml-1'/></span>}
                        {task.task_sub_task_count && <span className='text-muted-foreground text-sm'>{task.task_sub_task_count}<GitBranch className='h-3 w-3 inline ml-1'/></span>}

                    </div>
                </div>


            </div>
        </div>
    );
}