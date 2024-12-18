import React from 'react';
import { Crown, LogOut } from 'lucide-react';
import { getNameInitials } from "@/utils/Helper";
import { UserProfileDataInterface } from "@/services/ProfileService";
import mediaService from "@/services/MediaService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MemberPropInfoInterface {
    userInfo: UserProfileDataInterface;
    isAdmin: boolean;
    handleMakeAdmin: (id: string) => void;
    handleRemoveAdmin: (id: string) => void;
    handleRemoveMember: (id: string) => void;
    isSelf: boolean;
}

const MemberInfo: React.FC<MemberPropInfoInterface> = ({
                                                           userInfo,
                                                           isAdmin,
                                                           isSelf,
                                                           handleRemoveAdmin,
                                                           handleMakeAdmin,
                                                           handleRemoveMember
                                                       }) => {
    const profileImageRes = mediaService.getMediaURLForID(userInfo.user_profile_object_key || '');
    const nameInitial = getNameInitials(userInfo.user_name);

    const handleCrownClick = () => {
        if (isSelf) return;
        if (userInfo.user_is_admin) {
            handleRemoveAdmin(userInfo.user_uuid);
        } else {
            handleMakeAdmin(userInfo.user_uuid);
        }
    };

    const handleLogOutClick = () => {
        if (!isSelf) {
            handleRemoveMember(userInfo.user_uuid);
        }
    };

    return (
        <div className='grid grid-cols-6 gap-4 items-center h-16 w-full'>
            <div className='flex items-center col-span-4 space-x-3'>
                <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage
                        src={profileImageRes.mediaData?.url || ""}
                        alt="Profile icon"
                    />
                    <AvatarFallback>{nameInitial}</AvatarFallback>
                </Avatar>
                <div className='min-w-0 overflow-ellipsis truncate whitespace-nowrap'>
                    <div className='truncate font-medium'>{userInfo.user_name}</div>
                    <div className='truncate text-sm text-muted-foreground'>{userInfo.user_email}</div>
                </div>
            </div>

            <div className='flex justify-center'>
                {(userInfo.user_is_admin || isAdmin) && (
                    <Crown
                        className={`size-5 ${!isSelf ? "cursor-pointer" : ""}`}
                        fill={userInfo.user_is_admin ? '#facc15' : 'none'}
                        onClick={handleCrownClick}
                    />
                )}
            </div>

            <div className='flex justify-end'>
                {!isSelf && (
                    <LogOut
                        className='size-5 cursor-pointer'
                        onClick={handleLogOutClick}
                    />
                )}
            </div>
        </div>
    );
};

export default MemberInfo;

