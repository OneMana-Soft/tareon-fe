import {TaskInfoInterface} from "@/services/TaskService";
import {isZeroEpoch} from "@/utils/Helper.ts";
import { CircleCheck} from "lucide-react";
import {format} from "date-fns";
import {Badge} from "@/components/ui/badge.tsx";
type TaskListTaskProps = {
    taskInfo: TaskInfoInterface
    openTaskInfo?: (t: string) => void
    markTaskAsCompleted: () => void
};


export const MyTaskListTask = ({taskInfo, markTaskAsCompleted}:TaskListTaskProps) => {
    const taskCompleted  = taskInfo.task_status == 'done'

    const handleCheckClick = () =>{
        markTaskAsCompleted()
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center text-center gap-3">
                {taskInfo.task_project.project_is_admin && <CircleCheck
                    className={`size-5 ${taskCompleted ? 'text-green-600' : ''}`}
                    aria-hidden="true"
                    onClick={handleCheckClick}
                />}
                <div className=" max-w-sm truncate overflow-ellipsis overflow-hidden whitespace-nowrap">
                    {taskInfo.task_name}
                </div>
            </div>
            <div className='flex'>
                <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal max-w-sm overflow-ellipsis overflow-hidden whitespace-nowrap"
                >
                    {taskInfo.task_project.project_name}
                </Badge>
                <div className={` text-sm ml-2 mr-2 w-12 ${
                    !taskCompleted && new Date(taskInfo.task_due_date) < new Date() ? 'text-destructive' : ''}`}>
                    {taskInfo.task_due_date &&
                        !isZeroEpoch(taskInfo.task_due_date) &&
                        format(new Date(taskInfo.task_due_date), 'dd MMM')}
                </div>
            </div>
        </div>
    );
};
