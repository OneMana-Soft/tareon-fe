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
import  {RootState} from "@/store/store.ts";
import {openSideBarTaskInfo} from "@/store/slice/popupSlice.ts";
import {useNavigate} from "react-router-dom";
import {URL_PROJECT, URL_TEAM} from "@/constants/routes/appNavigation.ts";
import {useToast} from "@/hooks/use-toast.ts";
import {SearchTaskAttachmentRow} from "@/components/globalSearch/SearchTaskAttachmentRow.tsx";
import {SearchProjectAttachmentRow} from "@/components/globalSearch/searchProjectAttachmentRow.tsx";
import {useTranslation} from "react-i18next";
import {LoaderCircle} from "lucide-react";

export function AttachmentResult() {

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {toast} = useToast()
    const {t} = useTranslation()


    const searchQuery = useSelector((state:RootState)=>state.globalSearch.searchText)


    let queryParam = ''

    if(searchQuery) {
        queryParam = GetTaskStatusQueryParamByStatus({pageIndex:pageIndex, pageSize:pageSize, searchText:searchQuery});
    }

    const searchAttachmentInfo = searchService.getAttachmentsFromSearch(queryParam)

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

    const navigateToTeam = (id: string) => {
        if(!id) return
        navigate(`${URL_TEAM}/${id}`);
    }

    const handleDownload = (url: string, fileName: string) => {
        if (url) {
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } else {
            toast({
                title: t('failure'),
                description: t('downloadURLNotAvailable'),
                variant: "destructive",
            })
        }
    }

    return (
        <div>
            <div className="rounded-md border mb-4 text-left">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('file')}</TableHead>
                            <TableHead>{t('project')}</TableHead>
                            <TableHead>{t('task')}</TableHead>
                            <TableHead>{t('team')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!searchAttachmentInfo.data?.data && <TableRow>
                            <TableCell colSpan={4} className='h-24 text-center'>{searchAttachmentInfo.isLoading ?
                                <div className="flex items-center justify-center">
                                    <LoaderCircle className="h-4 w-4 animate-spin"/>
                                </div>
                                : t('noResultFound')}</TableCell>
                        </TableRow>}
                        {searchAttachmentInfo.data?.data && searchAttachmentInfo.data?.data.map((d, i) => {

                            if(d.attachment.attachment_task_id){
                                return(
                                    <TableRow key={i}>
                                        <SearchTaskAttachmentRow searchAttachmentInfo={d.attachment} navigateToTeam={navigateToTeam} navigateToProject={navigateToProject} openTaskInfo={openTaskInfo} downloadFile={handleDownload}/>
                                    </TableRow>

                                )
                            }

                            return(
                                <TableRow key={i}>
                                    <SearchProjectAttachmentRow searchAttachmentInfo={d.attachment} navigateToTeam={navigateToTeam} navigateToProject={navigateToProject} downloadFile={handleDownload}/>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
            <ResultPagination
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalPages={searchAttachmentInfo.data?.pageCount || 1}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}

            />
        </div>
    );
}
