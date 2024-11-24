import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './taskKanbanTaskCard';
import { prioritiesInterface } from './data';
import { GetTaskStatusQueryParamByStatus } from "@/utils/Helper.ts";
import taskService from "@/services/TaskService.ts";
import {Button} from "@/components/ui/button.tsx";
import {ListFilter} from "lucide-react";
import {useState} from "react";
import {
    TaskKanbanColumnPriorityFilter,
    taskKanbanColumnPriorityFilter
} from "@/components/task/taskKanbanColumnPriorityFilter.tsx";

type ColumnProps = {
    column: prioritiesInterface;
    projectFilter: string[]
};

export function TaskKanbanColumn({ column, projectFilter}: ColumnProps) {
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
    const queryString = GetTaskStatusQueryParamByStatus(true, column.value, priorityFilter, projectFilter);
    const taskInfo = taskService.getUserAssignedTaskList(queryString);
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
                        className='text-muted-foreground font-normal'> ({taskInfo.taskData?.data.user_task_count || 0})</span>
                </h2>
                <TaskKanbanColumnPriorityFilter activeList={priorityFilter} updateList={setPriorityFilter}/>
            </div>


            <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
                {taskInfo.taskData?.data.user_tasks && taskInfo.taskData.data.user_tasks.map((task) => (
                    <TaskCard
                        key={task.task_uuid}
                        task={task}
                    />
                ))}
            </div>
        </div>
    );
}


