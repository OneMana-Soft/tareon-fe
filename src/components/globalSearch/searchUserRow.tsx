import {
    TableCell,
} from "@/components/ui/table"
import  {
    OpenSearchUserInterface
} from "@/services/SearchService.ts";

interface SearchUserRowInterface {
    searchUserInfo ?: OpenSearchUserInterface
    openUserProfile: (id: string) => void
}

export function SearchUserRow({searchUserInfo, openUserProfile}:SearchUserRowInterface) {


    return (
        <>
            <TableCell className="font-medium w-28 group cursor-pointer whitespace-nowrap overflow-ellipsis truncate" onClick={()=>{openUserProfile(searchUserInfo?.user_id||'')}}>
                <span
                    className="group-hover:underline mr-2"
                >
                    {searchUserInfo?.user_name}
                </span>

            </TableCell>
            <TableCell className='w-48 whitespace-nowrap overflow-ellipsis truncate'>
                <div className="flex space-x-2 group cursor-pointer" >

                      {searchUserInfo?.user_email}

                </div>
            </TableCell>
        </>
    );
}
