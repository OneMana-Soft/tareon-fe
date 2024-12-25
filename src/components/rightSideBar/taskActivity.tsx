import {TaskActivityInterface} from "@/services/TaskService.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import mediaService from "@/services/MediaService.ts";
import {formatDateForComment, getNameInitials} from "@/utils/Helper.ts";
import {useTranslation} from "react-i18next";
import {taskActivityConst} from "@/components/rightSideBar/taskActivityConst.ts";

interface  TaskActivityProps {
    taskActivity: TaskActivityInterface
    openOtherUserProfile: (id: string) => void
}

export default function TaskActivity({taskActivity, openOtherUserProfile}: TaskActivityProps) {

    const profileMedia = mediaService.getMediaURLForID(taskActivity.activity_by.user_profile_object_key || '' )
    const nameInitial = getNameInitials(taskActivity.activity_by.user_name||'')
    const {t} = useTranslation()



    return (


        <div className="flex items-start gap-2 relative">
            <div className="relative">
                <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={profileMedia.mediaData?.url||''} alt="@shadcn" />
                    <AvatarFallback>{nameInitial}</AvatarFallback>
                </Avatar>{" "}
            </div>
            <div className="flex-1 pt-2">
                <p className="text-sm ">
                    <span className="font-medium hover:underline cursor-pointer" onClick={()=>{openOtherUserProfile(taskActivity.activity_by.user_uuid)}}>{taskActivity.activity_by.user_name}</span>{" "}
                    {t(taskActivityConst[taskActivity.activity_type].key)}.{" "}
                    <span className="text-muted-foreground">{formatDateForComment(taskActivity.activity_time)}</span>
                </p>
            </div>
        </div>


    )
}

