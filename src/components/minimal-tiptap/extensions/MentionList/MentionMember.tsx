import React from 'react'
import  {UserProfileDataInterface} from "@/services/ProfileService.ts";
import mediaService from "@/services/MediaService.ts";
import ProfileIcon from "../../../assets/user_profile.svg";
import './MentionList.scss'
import {User, UserCircle, UserIcon} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {getNameInitials} from "@/utils/Helper.ts";



interface ComboboxChannelMemberList {
    person: UserProfileDataInterface
    ind: number
    selectItem: (ind: number) => void
    selectedIndex: number
}

const MentionMember: React.FC<ComboboxChannelMemberList> = ({person, selectItem, ind, selectedIndex}) => {
    const profileMediaRes = mediaService.getMediaURLForID(person.user_profile_object_key || '')


    if (profileMediaRes.isError || profileMediaRes.isLoading) {
        return(<></>)
    }

    const nameInitials = getNameInitials(person.user_name)


    return (

        <div
            className={`item ${ind === selectedIndex ? "is-selected" : ""} flex-row justify-center items-center`}
            onClick={() => selectItem(ind)}
        >
            <Avatar className="h-8 w-8">
                <AvatarImage
                    src={profileMediaRes.mediaData?.url}
                    alt="Profile icon"
                />
                <AvatarFallback>{nameInitials}</AvatarFallback>
            </Avatar>
            <div className='flex-1 flex-col ml-2'>
                <div>{person.user_name}</div>
                <div className='text-xs'>@{person.user_email}</div>
            </div>
        </div>

    )
}

export default MentionMember
