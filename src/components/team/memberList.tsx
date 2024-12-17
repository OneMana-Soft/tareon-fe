import {useState} from "react";
import {ProjectInfoInterface} from "@/services/ProjectService.ts";
import {Input} from "@/components/ui/input.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import * as React from "react";
import profileService, {UserProfileDataInterface} from "@/services/ProfileService.ts";
import MemberInfo from "@/components/team/memberInfo.tsx";
import {useTranslation} from "react-i18next";


interface MembersListPropInterface {
    isAdmin: boolean
    usersList: UserProfileDataInterface[]
    handleMakeAdmin: (id: string) => void
    handleRemoveAdmin: (id: string) => void
    handleRemoveMember: (id: string) => void
}

const MembersList: React.FC<MembersListPropInterface> = ({isAdmin, usersList, handleMakeAdmin, handleRemoveAdmin, handleRemoveMember}) => {

    const selfProfile = profileService.getSelfUserProfile()
    const [query, setQuery] = useState('')
    const {t} = useTranslation()


    let foundSelf = false

    const filteredProject =
        query === ''
            ? usersList
            : usersList.filter((member) =>
            member.user_name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, ''))
        ) || [] as ProjectInfoInterface[]

    return (

        <div>

            <Input
                type="text"
                placeholder={t('memberSearch')}
                // className="w-full px-2 py-1 border-2 border-gray-300 rounded-full"
                onChange={(event) => setQuery(event.target.value)}
            />

            <div className="h-[60vh] mt-4 pl-3 pr-3 channel-members-list flex flex-col overflow-y-auto">
                {filteredProject?.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        {"No project found"}
                    </div>
                ) : (filteredProject.map((user, i) => {
                    let s = false
                    if(!foundSelf){
                        if(selfProfile.userData?.data.user_uuid == user.user_uuid) {
                            foundSelf = true
                            s = true
                        }
                    }

                    return (

                        <div key={(user.user_uuid)}>
                            <Separator orientation="horizontal" className={i ? 'invisible' : ''} />
                            <MemberInfo userInfo={user} isAdmin={isAdmin} handleRemoveMember={handleRemoveMember} handleMakeAdmin={handleMakeAdmin} handleRemoveAdmin={handleRemoveAdmin} isSelf={s}/>
                            <Separator orientation="horizontal" className="" />

                        </div>
                    )
                }))}
            </div>
        </div>

    );
};

export default MembersList;
