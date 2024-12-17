import React from "react";
import {Trash} from "lucide-react";
import { isZeroEpoch} from "@/utils/Helper.ts";
import {PostgresUserInterface} from "@/services/AdminService.ts";


interface AdminPropInfoInterface {
    userInfo: PostgresUserInterface
    handleRemoveAdmin: (emailId: string) => void
    isSelf: boolean

}

const AdminInfo: React.FC<AdminPropInfoInterface> = ({userInfo, isSelf, handleRemoveAdmin}) => {


    return (

        <div className='flex justify-between h-16 items-center '>
            <div className='flex space-x-3'>
                {userInfo.user_email}

            </div>

            <div>
                {
                    !isSelf && (isZeroEpoch(userInfo.user_deleted_at || '') &&
                        <Trash className='size-4 text-destructive cursor-pointer' onClick={() => {
                            handleRemoveAdmin(userInfo.user_email)
                        }}/>)
                }
            </div>
        </div>

    );
};

export default AdminInfo;
