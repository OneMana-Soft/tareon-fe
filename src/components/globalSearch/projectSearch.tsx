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
import { useSelector} from "react-redux";
import  {RootState} from "@/store/store.ts";
import {useNavigate} from "react-router-dom";
import {URL_PROJECT, URL_TEAM} from "@/constants/routes/appNavigation.ts";
import {SearchProjectRow} from "@/components/globalSearch/searchProjectRow.tsx";
import {useTranslation} from "react-i18next";

export function ProjectResult() {

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();
    const {t} = useTranslation()

    const searchQuery = useSelector((state:RootState)=>state.globalSearch.searchText)


    let queryParam = ''

    if(searchQuery) {
        queryParam = GetTaskStatusQueryParamByStatus({pageIndex:pageIndex, pageSize:pageSize, searchText:searchQuery});
    }

    const searchTaskAndCommentInfo = searchService.getProjectsFromSearch(queryParam)

    const navigateToProject = (id: string) => {
        if(!id) return
        navigate(`${URL_PROJECT}/${id}`);
    }

    const navigateToTeam = (id: string) => {
        if(!id) return
        navigate(`${URL_TEAM}/${id}`);
    }

    return (
        <div>
            <div className="rounded-md border mb-4 text-left">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('project')}</TableHead>
                            <TableHead>{t('team')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!searchTaskAndCommentInfo.data?.data && <TableRow>
                            <TableCell colSpan={2} className='h-24 text-center'>No result</TableCell>
                        </TableRow>}
                        {searchTaskAndCommentInfo.data?.data && searchTaskAndCommentInfo.data?.data.map((d, i) => (
                            <TableRow key={i} >
                                <SearchProjectRow searchProjectInfo={d.project} navigateToTeam={navigateToTeam} navigateToProject={navigateToProject}/>
                            </TableRow>
                        ))}
                    </TableBody>
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
