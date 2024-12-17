import { useState } from 'react';
import { statuses } from '@/components/task/data';
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
import {prioritiesInterface} from "@/components/task/data.tsx";
import {ProjectTaskKanbanColumn} from "@/components/project/projectTaskKanbanColumn.tsx";
import projectService from "@/services/ProjectService.ts";
import {KanbanAssigneeFilter} from "@/components/project/KanbanAssigneeFilter.tsx";
import {useTranslation} from "react-i18next";

interface ProjectTaskKanbanProps {
    projectId: string;
}
export const ProjectTaskKanban = ({projectId}: ProjectTaskKanbanProps) => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const {t} = useTranslation()
    const [activeProject, setActiveProject] = useState<string[]>([])
    const [viewableStatus, setViewableStatus] = useState({
        todo: true,
        inProgress: true,
        done: true
    });
    const projectInfo = projectService.getProjectInfo(projectId);



    const updateTaskStatus = async (taskStatus: string, taskId: string) => {

        try {
            await taskService.updateTaskStatus({task_status: taskStatus, task_uuid: taskId, task_project_uuid: projectId})
            toast({
                title: t('success'),
                description: t('updatedTaskStatus'),
            });

            mutate(
                key => typeof key === 'string' && key.startsWith(`/api/project/taskList/${projectId}?filters=`)
            )
        } catch (e) {

            const errorMessage = e instanceof Error
                ? e.message
                : TOAST_UNKNOWN_ERROR;

            toast({
                title:  t('failure'),
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

        if(!projectInfo.projectData?.data.project_is_admin || newStatus == taskInfo.task_status) return


        await updateTaskStatus(newStatus, taskId)
    }

    return (
        <div className="p-4">
            <div className='flex  mb-4 justify-between'>
                <KanbanAssigneeFilter activeList={activeProject} updateList={setActiveProject} projectId={projectId}/>

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
                            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {statuses.map((column:prioritiesInterface) => (
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
                            .filter((column: prioritiesInterface) => viewableStatus[column.value as keyof typeof viewableStatus])
                            .map((column: prioritiesInterface) => (
                                <ProjectTaskKanbanColumn
                                    key={column.value}
                                    column={column}
                                    projectFilter={activeProject}
                                    projectId={projectId}
                                />
                            ))}
                    </DndContext>
                </div>
            </div>
        </div>
    );
};