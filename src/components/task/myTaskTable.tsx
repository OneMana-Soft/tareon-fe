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
import taskService from "@/services/TaskService";
import columns from "./taskColumns";
import { useDebounce } from "@/hooks/use-debounce";
import {LoaderCircle} from "lucide-react";
import {useTranslation} from "react-i18next";

export const MyTaskTable = () => {
  const [urlParam, setUrlParam] = useState('');
  const { taskData, isLoading } = taskService.getUserAssignedTaskList(urlParam);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const taskSearchString = useDebounce(globalFilter, 500);

  const pagination = useCallback(
      () => ({
        pageIndex,
        pageSize,
      }),
      [pageIndex, pageSize]
  );

  const data = taskData?.data.user_tasks || [];
  const pageCount = taskData?.pageCount || 1;

  const {t} = useTranslation()

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination: pagination(),
    },
    enableRowSelection: true,
    manualPagination: true,
    getRowId: (originalRow) => originalRow.task_uuid,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });


  const getQueryStringFromState = useCallback(({ sorting, columnFilters, pageSize, pageIndex, taskSearchString }: {
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    pageSize: number;
    pageIndex: number;
    taskSearchString: string;
  }): string => {
    const params = new URLSearchParams();

    if (sorting.length > 0) {
      params.set('sorting', JSON.stringify(sorting.map(({ id, desc }) => ({ id, desc }))));
    }

    if (columnFilters.length > 0) {
      params.set('filters', JSON.stringify(columnFilters.map(({ id, value }) => ({ id, value }))));
    }

    params.set('pageSize', pageSize.toString());
    params.set('pageIndex', pageIndex.toString());

    if (taskSearchString) {
      params.set('taskSearchString', taskSearchString);
    }

    return params.toString();
  }, []);

  useEffect(() => {
    const up = getQueryStringFromState({ sorting, columnFilters, pageSize, pageIndex, taskSearchString });
    setUrlParam(up);
  }, [sorting, pageSize, pageIndex, columnFilters, taskSearchString, getQueryStringFromState]);

  return (
      <div className="space-y-4">
        <DataTableToolbar table={table} />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                              )}
                        </TableHead>
                    ))}
                  </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                      <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                              )}
                            </TableCell>
                        ))}
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center items-center"
                    >
                      {isLoading ?
                          <div className="flex items-center justify-center">
                            <LoaderCircle className="h-4 w-4 animate-spin"/>
                          </div>
                        : t('noResultFound')}
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
  );
};
