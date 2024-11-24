import React, { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {Check, ChevronDown, UserCircle, X} from "lucide-react"
import { cn } from "@/lib/utils"
import taskService, { CommentInfoInterface } from "@/services/TaskService"
import profileService, { UserProfileDataInterface, UserProfileInterface } from "@/services/ProfileService"
import mediaService, {AttachmentMediaReq} from "@/services/MediaService"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { formatDateForComment, getNameInitials, isZeroEpoch } from "@/utils/Helper.ts"
import { Content } from "@tiptap/core/dist/types"
import MinimalTiptapTask from "@/components/textInput/textInput.tsx"
import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { DropdownMenuContent } from "@/components/ui/dropdown-menu.tsx"
import {TOAST_TITLE_FAILURE, TOAST_TITLE_SUCCESS, TOAST_UNKNOWN_ERROR} from "@/constants/dailog/const.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import AttachmentIcon from "@/components/attachmentIcon/attachmentIcon.tsx";

interface TaskAttachmentProps {
    attachmentInfo: AttachmentMediaReq,
    taskUUID: string
    isAdmin: boolean
}

export default function TaskAttachment({ attachmentInfo, taskUUID, isAdmin}: TaskAttachmentProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false) // Track dropdown state

    const taskInfo = taskService.getTaskInfo(taskUUID)
    const mediaInfo = mediaService.getMediaURLForID(attachmentInfo.attachment_obj_key)


    const { toast } = useToast();



    const handleDownload = () => {
        if (mediaInfo.mediaData?.url) {
            const link = document.createElement('a')
            link.href = mediaInfo.mediaData.url
            link.download = attachmentInfo.attachment_file_name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } else {
            toast({
                title: TOAST_TITLE_FAILURE,
                description: "Download URL not available",
                variant: "destructive",
            })
        }
    }


    const handleDelete = async () => {
        try {

            await taskService.deleteTaskAttachment(attachmentInfo.attachment_obj_key||'')
            toast({
                title: TOAST_TITLE_SUCCESS,
                description: `Updated task comment`,
            })

            await taskInfo.mutate()

        } catch (e) {

            const errorMessage = e instanceof Error
                ? e.message
                : TOAST_UNKNOWN_ERROR;

            toast({
                title: TOAST_TITLE_FAILURE,
                description: `Failed to update task desc: ${errorMessage}`,
                variant: "destructive",
            })

            return
        }

    }

    return (
        <div
            className='flex group relative justify-center items-center m-1 mt-2 p-1 rounded-xl border-2'
        >
            <div>
                <AttachmentIcon fileName={attachmentInfo.attachment_file_name}/>
            </div>
            <div className="flex-col">
                <div className="text-ellipsis truncate max-w-40 text-xs ">
                    {attachmentInfo.attachment_file_name}
                </div>
                <a href={mediaInfo.mediaData?.url || ''} download={attachmentInfo.attachment_file_name} target='_blank' className='text-xs hover:underline'>
                  Download
                </a>

            </div>

            <div>
                {isAdmin && <DropdownMenu
                    open={isDropdownOpen}
                    onOpenChange={(open) => setIsDropdownOpen(open)}
                >
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='outline'
                            size='icon'
                            className={'!p-1 invisible group-hover:visible ' + (isDropdownOpen?'visible':'')}
                        >
                            <ChevronDown className='h-5 w-5 text-muted-foreground'/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-fit">
                        <DropdownMenuItem className='hover:cursor-pointer'
                                          onClick={handleDownload}>
                            <span>Download</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem className='hover:cursor-pointer' onClick={handleDelete}>
                            <span>Delete</span>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>}
            </div>
        </div>
    )
}
