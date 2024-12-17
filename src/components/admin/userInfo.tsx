import React from "react";
import { Trash} from "lucide-react";
import {getNameInitials, isZeroEpoch} from "@/utils/Helper.ts";
import {Button} from "@/components/ui/button.tsx";
import {UserProfileDataInterface} from "@/services/ProfileService.ts";
import mediaService from "@/services/MediaService.ts";
import {useTranslation} from "react-i18next";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";


interface MemberPropInfoInterface {
    userInfo: UserProfileDataInterface
    handleDeleteUser: (id: string) => void
    handleUnDeleteUser: (id: string) => void
    isSelf: boolean

}

const UserInfo: React.FC<MemberPropInfoInterface> = ({userInfo, isSelf, handleDeleteUser, handleUnDeleteUser}) => {

    const profileImageRes = mediaService.getMediaURLForID(userInfo.user_profile_object_key || '')

    const nameInitial = getNameInitials(userInfo.user_name||'');
    const {t} = useTranslation()


    return (

        <div className='flex justify-between h-16 items-center '>
            <div className='flex space-x-3'>
                <Avatar className="h-12 w-12">
                    <AvatarImage
                        src={profileImageRes.mediaData?.url || ""}
                        alt="Profile icon"
                    />
                    <AvatarFallback>
                        {nameInitial}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <div className='w-sm overflow-ellipsis truncate whitespace-nowrap'>
                        {userInfo.user_name}
                    </div>
                    <div className='w-sm overflow-ellipsis truncate whitespace-nowrap text-muted-foreground'>
                        {userInfo.user_email}
                    </div>
                </div>

            </div>

            <div>
                {
                    !isSelf && (isZeroEpoch(userInfo.user_deleted_at || '') ?
                        <Trash className='size-4 text-destructive cursor-pointer' onClick={() => {
                            handleDeleteUser(userInfo.user_uuid)
                        }}/> :
                        <Button variant='destructive' onClick={() => {
                            handleUnDeleteUser(userInfo.user_uuid)
                        }}>
                            {t('undelete')}
                        </Button>)
                }
            </div>
        </div>

    );
};

export default UserInfo;
