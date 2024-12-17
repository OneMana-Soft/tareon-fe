import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {ResultPagination} from "@/components/globalSearch/resultPagination.tsx";
import {GetTaskStatusQueryParamByStatus} from "@/utils/Helper.ts";
import {useState} from "react";
import searchService from "@/services/SearchService.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store.ts";
import {SearchTaskRow} from "@/components/globalSearch/searchTaskRow.tsx";
import {openSideBarTaskInfo} from "@/store/slice/popupSlice.ts";
import {useNavigate} from "react-router-dom";
import {URL_PROJECT} from "@/constants/routes/appNavigation.ts";
import {useTranslation} from "react-i18next";


export function TaskResult() {

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {t} = useTranslation()

    const searchQuery = useSelector((state:RootState)=>state.globalSearch.searchText)


    let queryParam = ''

    if(searchQuery) {
        queryParam = GetTaskStatusQueryParamByStatus({pageIndex:pageIndex, pageSize:pageSize, searchText:searchQuery});
    }

    const searchTaskAndCommentInfo = searchService.getTaskAndCommentsFromSearch(queryParam)

    const openTaskInfo =(taskId: string) => {
        // Ensure `dispatch` and `openSideBarTaskInfo` are properly imported or defined.
        dispatch(
            openSideBarTaskInfo({
                taskId: taskId || "",
            })
        );
    }

    const navigateToProject = (id: string) => {
        if(!id) return
        navigate(`${URL_PROJECT}/${id}`);
    }

    return (
        <div>
            <div className="rounded-md border mb-4 text-left">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('title')}</TableHead>
                            <TableHead className='w-36 whitespace-nowrap overflow-ellipsis truncate'>{t('status')}</TableHead>
                            <TableHead
                                className='w-32 whitespace-nowrap overflow-ellipsis truncate'>{t('priority')}</TableHead>
                            <TableHead
                                className='w-48 whitespace-nowrap overflow-ellipsis truncate'>{t('project')}</TableHead>
                            <TableHead
                                className='w-48 whitespace-nowrap overflow-ellipsis truncate'>{t('assignee')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!searchTaskAndCommentInfo.data?.data && <TableRow>
                            <TableCell colSpan={5} className='h-24 text-center'>{t('noResult')}</TableCell>
                        </TableRow>}
                        {searchTaskAndCommentInfo.data?.data && searchTaskAndCommentInfo.data?.data.map((d, i) => (
                            <TableRow key={i} >
                                <SearchTaskRow searchTaskCommentInfo={d.comment} searchTaskInfo={d.task} openTaskInfo={openTaskInfo} navigateToProject={navigateToProject}/>
                            </TableRow>
                        ))}
                    </TableBody>
                    {/*<TableFooter>*/}
                    {/*    <TableRow>*/}
                    {/*        <TableCell colSpan={3}>Total</TableCell>*/}
                    {/*        <TableCell className="text-right">$2,500.00</TableCell>*/}
                    {/*    </TableRow>*/}
                    {/*</TableFooter>*/}
                </Table>
                </div>
                <ResultPagination
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalPages={searchTaskAndCommentInfo.data?.pageCount || 1}
                    setPageIndex={setPageIndex}
                    setPageSize={setPageSize}

                />
        </div>
    );
}
