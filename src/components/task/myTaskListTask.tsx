"use client";

import { useCallback, useEffect, useState } from "react";
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "@/components/task/taskTablePagitation";
import { DataTableToolbar } from "@/components/task/taskTableToolbar";
import taskService, {TaskInfoInterface} from "@/services/TaskService";
import columns from "./taskColumns";
import { useDebounce } from "@/hooks/use-debounce";
import {GetTaskStatusQueryParamByStatus, isZeroEpoch} from "@/utils/Helper.ts";
import {CheckCircle, CircleCheck} from "lucide-react";
import {CheckIcon} from "@radix-ui/react-icons";
import {format} from "date-fns";
import {Badge} from "@/components/ui/badge.tsx";
type TaskListTaskProps = {
    taskInfo: TaskInfoInterface
    openTaskInfo?: (t: string) => void
    markTaskAsCompleted: () => void
};


export const MyTaskListTask = ({taskInfo, markTaskAsCompleted}:TaskListTaskProps) => {
    const taskCompleted  = taskInfo.task_status == 'done'

    const handleCheckClick = (e) =>{
        e.stopPropagation();
        markTaskAsCompleted()
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center text-center gap-3">
                <CircleCheck className={`size-5 ${taskCompleted ? 'text-primary-foreground':''}`} aria-hidden="true" fill={`rgb(22 163 74)`}
                    onClick={handleCheckClick}
                />
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
                <div className='text-muted-foreground text-sm ml-2 mr-2 w-12'>
                    {taskInfo.task_due_date &&
                        !isZeroEpoch(taskInfo.task_due_date) &&
                        format(new Date(taskInfo.task_due_date), 'dd MMM')}
                </div>
            </div>
        </div>
    );
};
