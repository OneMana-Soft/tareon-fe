import { useState } from 'react';
import { statuses } from './data';
import { TaskKanbanColumn } from './taskKanbanColumn';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {
    MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import taskService, {TaskInfoInterface} from "@/services/TaskService.ts";
import {TOAST_UNKNOWN_ERROR} from "@/constants/dailog/const.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {mutate} from "swr";
import {openCreateTaskPopup} from "@/store/slice/popupSlice.ts";
import {CirclePlus} from "lucide-react";
import {useDispatch} from "react-redux";
import {KanbanProjectFilter} from "@/components/task/KanbanProjectFilter.tsx";
import {useTranslation} from "react-i18next";


export const MyTaskKanban = () => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const {t} = useTranslation()
    const [activeProject, setActiveProject] = useState<string[]>([])
    const [viewableStatus, setViewableStatus] = useState({
        todo: true,
        inProgress: true,
        done: true
    });

    const updateTaskStatus = async (taskStatus: string, taskId: string, taskProjectUUID: string) => {

        try {
            await taskService.updateTaskStatus({task_status: taskStatus, task_uuid: taskId, task_project_uuid: taskProjectUUID})
            toast({
                title: t('success'),
                description: t('updatedTaskStatus'),
            });

            await mutate(
                key => typeof key === 'string' && key.startsWith('/api/user/assignedTaskList?filters=')
            )
        } catch (e) {

            const errorMessage = e instanceof Error
                ? e.message
                : TOAST_UNKNOWN_ERROR;

            toast({
                title: t('failure'),
                description: `${t('failedToUpdateTaskStatus')}: ${errorMessage}`,
                variant: "destructive",
            })

            return

        }


    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        const taskId = active.id as string;
        const newStatus = over.id as string;
        const taskInfo = active.data.current as unknown as TaskInfoInterface;

        if(!taskInfo.task_project.project_is_admin || newStatus == taskInfo.task_status) return


        await updateTaskStatus(newStatus, taskId, taskInfo.task_project.project_uuid)
    }

    return (
        <div className="p-4">
            <div className='flex  mb-4 justify-between'>
                <KanbanProjectFilter activeList={activeProject} updateList={setActiveProject}/>

                <div className='flex space-x-2'>
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto hidden h-8 lg:flex"
                        onClick={()=>{dispatch(openCreateTaskPopup())}}
                    >
                        <CirclePlus className='h-4 w-4'/>{" "}{t('createTask')}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto hidden h-8 lg:flex"
                            >
                                <MixerHorizontalIcon className="mr-2 h-4 w-4" />
                                {t('view')}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[150px]">
                            <DropdownMenuLabel>{t('toggleColumns')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {statuses.map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.value}
                                    className="capitalize"
                                    checked={viewableStatus[column.value as keyof typeof viewableStatus]}
                                    onCheckedChange={(value) =>
                                        setViewableStatus((prev) => ({
                                            ...prev,
                                            [column.value]: value
                                        }))
                                    }
                                >
                                    {column.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>


            <div className="mt-2">
                <div className="flex h-full gap-4 pb-4">
                    <DndContext onDragEnd={handleDragEnd}>
                        {statuses
                            .filter(column => viewableStatus[column.value as keyof typeof viewableStatus])
                            .map((column) => (
                                <TaskKanbanColumn
                                    key={column.value}
                                    column={column}
                                    projectFilter={activeProject}

                                />
                            ))}
                    </DndContext>
                </div>
            </div>
        </div>
    );
};