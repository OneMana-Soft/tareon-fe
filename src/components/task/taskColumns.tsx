"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { priorities, statuses } from "./data";
import { DataTableColumnHeader } from "./taskTableColumnHeader.tsx";
import  store  from '@/store/store.ts'
import {openSideBarTaskInfo} from "@/store/slice/popupSlice.ts";
import {isZeroEpoch} from "@/utils/Helper.ts";
import {format} from "date-fns";
import {GitBranch, MessageSquare} from "lucide-react";
import {TaskInfoInterface} from "@/services/TaskService.ts";
import i18n from "i18next";


const openTaskInfo =(taskId: string) => {
    // Ensure `dispatch` and `openSideBarTaskInfo` are properly imported or defined.
    store.dispatch(
        openSideBarTaskInfo({
            taskId: taskId || "",
        })
    );
}
const columns: ColumnDef<TaskInfoInterface>[] = [
    // {
    //     id: "select",
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={
    //                 table.getIsAllPageRowsSelected() ||
    //                 (table.getIsSomePageRowsSelected() && "indeterminate")
    //             }
    //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //             aria-label="Select all"
    //             className="translate-y-[2px]"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox
    //             checked={row.getIsSelected()}
    //             onCheckedChange={(value) => row.toggleSelected(!!value)}
    //             aria-label="Select row"
    //             className="translate-y-[2px]"
    //         />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    // },
    {
        accessorKey: "task_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={i18n.t('title')} />
        ),
        cell: ({ row }) => {
            const label = row.original.task_label;

            return (
                <div className="flex space-x-2 group hover:cursor-pointer"
                     onClick={()=>{openTaskInfo(row.original.task_uuid)}}
                >
                    {label && <Badge variant="secondary">{label}</Badge>}
                    <span
                        className="max-w-[500px] truncate font-medium group-hover:underline task-name mr-2"
                    >
            {row.getValue("task_name")}
          </span>
                    {row.original.task_comment_count && <span className='text-muted-foreground '>{row.original.task_comment_count}<MessageSquare className='h-3 w-3 inline ml-1'/></span>}
                    {row.original.task_sub_task_count && <span className='text-muted-foreground '>{row.original.task_sub_task_count}<GitBranch className='h-3 w-3 inline ml-1'/></span>}

                </div>
            );
        },
        enableSorting: false,
    },
    {
        accessorKey: "task_status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={i18n.t("status")} />
        ),
        cell: ({ row }) => {
            const status = statuses.find(
                (status) => status.value === row.getValue("task_status")
            );

            if (!status) {
                return null;
            }

            return (
                <div className="flex w-full items-center hover: cursor-pointer" onClick={()=>{openTaskInfo(row.original.task_uuid)}} >
                    {status.icon && (
                        <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{i18n.t(status.value)}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableSorting: false,
    },
    {
        accessorKey: "task_priority",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={i18n.t("priority")} />
        ),
        cell: ({ row }) => {
            const priority = priorities.find(
                (priority) => priority.value === row.getValue("task_priority")
            );

            if (!priority) {
                return null;
            }

            return (
                <div className="flex items-center w-full hover:cursor-pointer" onClick={()=>{openTaskInfo(row.original.task_uuid)}}>
                    {priority.icon && (
                        <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{i18n.t(priority.value)}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableSorting: false,
    },
    {
        accessorKey: "task_project_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={i18n.t('project')} />
        ),
        cell: ({ row }) => (
            <div className="flex space-x-2">
        <span className="max-w-[500px] truncate ">
          {row.original.task_project.project_name}
        </span>
            </div>
        ),
        enableSorting: false,
        filterFn: (row, _, filterValue) => {
            return  filterValue.includes(row.original.task_project.uid);
        },
    },
    {
        accessorKey: "task_start_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={i18n.t("startDate")} />
        ),
        cell: ({ row }) =>{

            const d = new Date(row.getValue("task_start_date"))
            return (
            <div className="flex space-x-2 w-full hover: cursor-pointer text-xs" onClick={()=>{openTaskInfo(row.original.task_uuid)}}>
        <span className=" truncate ">
          {!isZeroEpoch(row.getValue("task_start_date")) ? format(d, "dd MMM yyyy"):"--"}
        </span>
            </div>
        )},
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "task_due_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={i18n.t("dueDate")} />
        ),
        cell: ({ row }) => {
            const d = new Date(row.getValue("task_due_date"))
            return (
            <div className="flex space-x-2 hover: cursor-pointer w-full text-xs" onClick={()=>{openTaskInfo(row.original.task_uuid)}}>
        <span className={`${
            d < new Date() && !isZeroEpoch(row.getValue("task_due_date")) && row.original.task_status !== 'done'? 'text-destructive' : ''
                                } `}>
          {!isZeroEpoch(row.getValue("task_due_date")) ? format(d, "dd MMM yyyy") : "--"}
        </span>
            </div>
        )},
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "task_created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={i18n.t("createdDate")} />
        ),
        cell: ({ row }) => {
            const d = new Date(row.getValue("task_created_at"))
            return (
                <div className="flex space-x-2 hover: cursor-pointer w-full text-xs" onClick={()=>{openTaskInfo(row.original.task_uuid)}}>
        <span >
          {!isZeroEpoch(row.getValue("task_created_at")) ? format(d, "dd MMM yyyy") : "--"}
        </span>
                </div>
            )},
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    // Uncomment if needed
    // {
    //   id: "actions",
    //   cell: ({ row }) => <DataTableRowActions row={row} />,
    // },
];

export default columns;
