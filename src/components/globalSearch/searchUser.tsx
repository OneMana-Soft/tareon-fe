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
import {openOtherUserProfilePopup} from "@/store/slice/popupSlice.ts";
import {SearchUserRow} from "@/components/globalSearch/searchUserRow.tsx";
import {useTranslation} from "react-i18next";

export function UserResult() {

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const dispatch = useDispatch();
    const {t} = useTranslation()


    const searchQuery = useSelector((state:RootState)=>state.globalSearch.searchText)


    let queryParam = ''

    if(searchQuery) {
        queryParam = GetTaskStatusQueryParamByStatus({pageIndex:pageIndex, pageSize:pageSize, searchText:searchQuery});
    }

    const searchUserInfo = searchService.getUsersFromSearch(queryParam)

    const openUserProfile =(id: string) => {
        dispatch(
            openOtherUserProfilePopup({ userId: id})
        );
    }


    return (
        <div>
            <div className="rounded-md border mb-4 text-left">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('user')}</TableHead>
                            <TableHead>{t('email')}</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!searchUserInfo.data?.data && <TableRow>
                            <TableCell colSpan={2} className='h-24 text-center'>No result</TableCell>
                        </TableRow>}
                        {searchUserInfo.data?.data && searchUserInfo.data?.data.map((d, i) => {

                            return(
                                <TableRow key={i}>
                                    <SearchUserRow openUserProfile={openUserProfile} searchUserInfo={d.user}/>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
            <ResultPagination
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalPages={searchUserInfo.data?.pageCount || 1}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}

            />
        </div>
    );
}
