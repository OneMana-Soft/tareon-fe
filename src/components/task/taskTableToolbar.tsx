import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/task/taskTableViewOptions";
import { priorities, statuses } from "./data";
import { DataTableFacetedFilter } from "@/components/task/tableFacetedFilter";
import {CirclePlus} from "lucide-react";
import * as React from "react";
import {useDispatch} from "react-redux";
import { openCreateTaskPopup} from "@/store/slice/popupSlice.ts";
import {DataTableFacetedProjectFilter} from "@/components/task/tableFacetedProjectFilter.tsx";
import {DataTableFacetedAssigneeFilter} from "@/components/task/tableFacetedAssigneeFilter.tsx";
import {useTranslation} from "react-i18next";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    projectId?: string;
}

export function DataTableToolbar<TData>({
                                            table,
                                            projectId
                                        }: DataTableToolbarProps<TData>) {
    const dispatch = useDispatch()
    const isFiltered = table.getState().columnFilters.length > 0;

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        table.setGlobalFilter(event.target.value);
    }, [table]);

    const handleResetFilters = useCallback(() => {
        table.resetColumnFilters();
        table.setGlobalFilter("");
    }, [table]);
    const {t} = useTranslation()


    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder={t('filterTasksPlaceholder')}
                    value={(table.getState().globalFilter as string) || ""}
                    onChange={handleInputChange}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("task_status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("task_status")}
                        title={t('status')}
                        options={statuses}
                    />
                )}
                {table.getColumn("task_priority") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("task_priority")}
                        title={t('priority')}
                        options={priorities}
                    />
                )}
                {!projectId && table.getColumn("task_project_name") && (
                    <DataTableFacetedProjectFilter
                        column={table.getColumn("task_project_name")}
                        title={t('project')}
                    />
                )}
                {projectId && table.getColumn("task_assignee_name") && (
                    <DataTableFacetedAssigneeFilter
                        column={table.getColumn("task_assignee_name")}
                        title={t('assignee')}
                        projectId={projectId||''}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={handleResetFilters}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className='flex gap-x-2'>
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto hidden h-8 lg:flex"
                    onClick={()=>{
                            dispatch(openCreateTaskPopup())

                    }
                }
                >
                    <CirclePlus className='h-4 w-4'/>{" "}{t('createTask')}
                </Button>
                <DataTableViewOptions table={table} />
            </div>

        </div>
    );
}

