import { useDroppable } from '@dnd-kit/core';
import { prioritiesInterface } from '@/components/task/data';
import { GetTaskStatusQueryParamByStatus } from "@/utils/Helper.ts";
import taskService from "@/services/TaskService.ts";
import {useState} from "react";
import {
    TaskKanbanColumnPriorityFilter,
} from "@/components/task/taskKanbanColumnPriorityFilter.tsx";
import {ProjectTaskCard} from "@/components/project/projectTaskKanbanTaskCard.tsx";

type ColumnProps = {
    column: prioritiesInterface;
    projectFilter: string[]
    projectId: string
};

export function ProjectTaskKanbanColumn({ column, projectFilter, projectId}: ColumnProps) {
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
    const queryString = GetTaskStatusQueryParamByStatus({getAll:true, status: column.value, priorityFilter, projectFilter});
    const taskInfo = taskService.getProjectTaskList(projectId, queryString);
    const { setNodeRef } = useDroppable({
        id: column.value,
    });

    return (
        <div className="flex-col flex w-80 rounded-lg border-2 shadow p-4">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold inline ">
                    {column.icon &&
                    <column.icon className='inline mr-2 h-6 w-6'/>}
                    {column.label}
                    <span
                        className='text-muted-foreground font-normal'> ({taskInfo.projectData?.data.project_task_count || 0})</span>
                </h2>
                <TaskKanbanColumnPriorityFilter activeList={priorityFilter} updateList={setPriorityFilter}/>
            </div>


            <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
                {taskInfo.projectData?.data.project_tasks && taskInfo.projectData?.data.project_tasks.map((task) => (
                    <ProjectTaskCard
                        key={task.task_uuid}
                        task={task}
                    />
                ))}
            </div>
        </div>
    );
}


