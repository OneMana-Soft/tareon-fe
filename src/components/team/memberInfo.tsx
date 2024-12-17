import {Crown, LogOut} from "lucide-react";
import {getNameInitials} from "@/utils/Helper.ts";
import {UserProfileDataInterface} from "@/services/ProfileService.ts";
import mediaService from "@/services/MediaService.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";


interface MemberPropInfoInterface {
    userInfo: UserProfileDataInterface
    isAdmin: boolean
    handleMakeAdmin: (id: string) => void
    handleRemoveAdmin: (id: string) => void
    handleRemoveMember: (id: string) => void
    isSelf: boolean

}

const MemberInfo: React.FC<MemberPropInfoInterface> = ({userInfo, isAdmin, isSelf, handleRemoveAdmin, handleMakeAdmin}) => {

    const profileImageRes = mediaService.getMediaURLForID(userInfo.user_profile_object_key || '')

    const handleCrownClick = () => {
        if(isSelf) return
        if(userInfo.user_is_admin) {
            handleRemoveAdmin(userInfo.user_uuid)
            return
        }
        handleMakeAdmin(userInfo.user_uuid)
    }

    const nameInitial = getNameInitials(userInfo.user_name);

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
                {(userInfo.user_is_admin || isAdmin) && <Crown className={`size-5 ${!isSelf?"cursor-pointer":""}`} fill={`${userInfo.user_is_admin ? '#facc15' : 'none'}`} onClick={handleCrownClick}/>}
            </div>
            <div className='min-w-4 pr-2'>
                {!isSelf ? <LogOut className='size-4'/>:<div className='w-4'/>}
            </div>
        </div>

    );
};

export default MemberInfo;
