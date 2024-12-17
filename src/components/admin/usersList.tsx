import { useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {UserProfileDataInterface} from "@/services/ProfileService.ts";
import adminService from "@/services/AdminService.ts";
import UserInfo from "@/components/admin/userInfo.tsx";
import {useTranslation} from "react-i18next";


interface MembersListPropInterface {
    usersList: UserProfileDataInterface[];
    handleDeleteUser: (id: string) => void
    handleUnDeleteUser: (id: string) => void
}

const UsersList: React.FC<MembersListPropInterface> = ({usersList, handleDeleteUser, handleUnDeleteUser}) => {

    const selfProfile = adminService.getSelfAdminProfile()

    const [query, setQuery] = useState('')
    const {t} = useTranslation()

    let foundSelf = false

    const filteredUsers =
        query === ''
            ? usersList
            : usersList.filter((member:UserProfileDataInterface) =>
            member.user_name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, ''))
        ) || [] as UserProfileDataInterface[]

    return (

        <div>

            <Input
                type="text"
                placeholder={t('memberSearch')}
                // className="w-full px-2 py-1 border-2 border-gray-300 rounded-full"
                onChange={(event) => setQuery(event.target.value)}
            />

            <div className="h-[60vh] mt-4 pl-3 pr-3 channel-members-list flex flex-col overflow-y-auto">
                {filteredUsers?.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        {t('noMemberFound')}
                    </div>
                ) : (filteredUsers.map((user, i) => {
                    let s = false
                    if(!foundSelf){
                        if(selfProfile.data?.data.user_uuid== user.user_uuid) {
                            foundSelf = true
                            s = true
                        }
                    }

                    return (

                        <div key={(user.user_uuid)}>
                            <Separator orientation="horizontal" className={i ? 'invisible' : ''} />
                            <UserInfo userInfo={user} handleDeleteUser={handleDeleteUser} handleUnDeleteUser={handleUnDeleteUser} isSelf={s}/>
                            <Separator orientation="horizontal" className="" />

                        </div>
                    )
                }))}
            </div>
        </div>

    );
};

export default UsersList;
