import React, { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {Check, ChevronDown, UserCircle, X} from "lucide-react"
import { cn } from "@/lib/utils"
import taskService, { CommentInfoInterface } from "@/services/TaskService"
import profileService, { UserProfileDataInterface, UserProfileInterface } from "@/services/ProfileService"
import mediaService from "@/services/MediaService"
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
import TaskAttachment from "@/components/rightSideBar/taskAttachment.tsx";
import TaskCommentAttachment from "@/components/rightSideBar/taskCommentAttachment.tsx";

interface TaskCommentProps {
    commentInfo: CommentInfoInterface,
    taskUUID:  string
    isAdmin: boolean
    isOwner: boolean
}

export default function TaskComment({ commentInfo, taskUUID, isOwner, isAdmin }: TaskCommentProps) {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false) // Track dropdown state
    const profileImageRes = mediaService.getMediaURLForID(commentInfo.comment_created_by.user_profile_object_key || '')

    const taskInfo = taskService.getTaskInfo(taskUUID)

    const [enableEdit, setEnableEdit] = useState(false)

    const { toast } = useToast();

    const [localCommentBody, setLocalCommentBody] = useState(commentInfo.comment_html_text)

    const nameInitial = getNameInitials(commentInfo.comment_created_by.user_name)

    const handleDeleteComment = async () => {
        try {
            await taskService.deleteTaskComment(commentInfo.comment_uuid)
            toast({
                title: TOAST_TITLE_SUCCESS,
                description: `Deleted task comment`,
            })

            await taskInfo.mutate()

        }catch (e) {
            const errorMessage = e instanceof Error
                ? e.message
                : TOAST_UNKNOWN_ERROR;

            toast({
                title: TOAST_TITLE_FAILURE,
                description: `Failed to delete task: ${errorMessage}`,
                variant: "destructive",
            })

            return
        }
    }

    const handleUpdateComment = async () => {
        try {

            await taskService.updateTaskComment({task_comment_uuid:  commentInfo.comment_uuid, task_comment_body: localCommentBody})
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

        setEnableEdit(false)
    }

    return (
        <div>

        <div
            className='flex mt-4 group min-h-28'
        >
            <div>
                <Avatar className="h-10 w-10">
                    <AvatarImage
                        src={profileImageRes.mediaData?.url || ""}
                        alt="Profile icon"
                    />
                    <AvatarFallback>{nameInitial}</AvatarFallback>
                </Avatar>
            </div>

            <div className='flex-1 pl-2 pr-2 mb-2'>
                <div>
                    <span className='font-medium'>{commentInfo.comment_created_by.user_name}</span><span
                    className='text-muted-foreground'>{" · " + formatDateForComment(commentInfo.comment_created_at)}</span>
                    {commentInfo.comment_updated_at && !isZeroEpoch(commentInfo.comment_updated_at) &&
                        <span className='text-muted-foreground'>{" (edited)"}</span>}
                </div>
                <div>
                    <MinimalTiptapTask
                        throttleDelay={3000}
                        className={cn('w-full rounded-xl !min-h-2' + (enableEdit ? '' : ' !border-0 !shadow-none !p-0 -ml-4 -mt-2'))}
                        editorContentClassName="overflow-auto"
                        output="html"
                        content={localCommentBody}
                        placeholder="Add comment..."
                        editable={enableEdit}
                        buttonLabel='Save'
                        buttonOnclick={() => {
                            handleUpdateComment()
                        }}
                        secondaryButtonLabel='Cancel'
                        secondaryButtonOnclick={() => {
                            setEnableEdit(false)
                        }}
                        editorClassName="focus:outline-none px-5 py-4"
                        onChange={(content: Content) => {
                            setLocalCommentBody(content.toString() || '')
                        }}
                    />
                </div>

            </div>
            {(isOwner || isAdmin) && <div>
                <DropdownMenu
                    open={isDropdownOpen}
                    onOpenChange={(open) => setIsDropdownOpen(open)}
                >
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='outline'
                            size='icon'
                            className={cn(isDropdownOpen ? "visible" : "invisible", "group-hover:visible")}
                        >
                            <ChevronDown className='h-3 w-3 text-muted-foreground'/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-fit">
                        {isOwner && <DropdownMenuItem className='hover:cursor-pointer'
                                                      onClick={() => setEnableEdit(!enableEdit)}>
                            <span>Edit</span>
                        </DropdownMenuItem>}
                        {(isOwner || isAdmin) &&
                            <DropdownMenuItem className='hover:cursor-pointer' onClick={handleDeleteComment}>
                                <span>Delete</span>
                            </DropdownMenuItem>
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>}

        </div>
            {!enableEdit && commentInfo.comment_attachments && <div className="flex flex-wrap mb-4 ml-8">
                {commentInfo.comment_attachments.map(
                    (file) => {
                        return (
                            <div key={file.attachment_uuid}>
                                <TaskCommentAttachment attachmentInfo={file} />
                            </div>
                        );
                    }
                )}
            </div>}
        </div>

    )
}
