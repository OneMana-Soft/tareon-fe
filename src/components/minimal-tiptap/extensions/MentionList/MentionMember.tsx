import React from 'react'
import  {UserProfileDataInterface} from "@/services/ProfileService.ts";
import mediaService from "@/services/MediaService.ts";
import './MentionList.scss'
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
            className={`item ${ind === selectedIndex ? "bg-accent" : ""} flex p-2 justify-center items-center`}
            onClick={() => selectItem(ind)}
        >
            <div>
                <Avatar className="h-8 w-8">
                    <AvatarImage
                        src={profileMediaRes.mediaData?.url}
                        alt="Profile icon"
                    />
                    <AvatarFallback>{nameInitials}</AvatarFallback>
                </Avatar>
            </div>

            <div className='flex-col ml-2'>
                <div>{person.user_name}</div>
                <div className='text-xs max-w-36 overflow-ellipsis truncate whitespace-nowrap'>{person.user_email}</div>
            </div>
        </div>

    )
}

export default MentionMember
