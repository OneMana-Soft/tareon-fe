import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import taskService from "@/services/TaskService"
import profileService from "@/services/ProfileService"
import mediaService from "@/services/MediaService"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {useTranslation} from "react-i18next";

interface SubTaskAssigneeProps {
    userUUID: string | undefined
    taskUUID: string
    assigneeUpdate: (id: string | undefined) => void
}

export default function SubTaskAssignee({ userUUID, taskUUID, assigneeUpdate }: SubTaskAssigneeProps) {
    const [assigneePopoverOpen, setAssigneePopoverOpen] = useState(false)
    const {t} = useTranslation()


    const taskInfo = taskService.getTaskInfo(taskUUID)
    const userProfile = profileService.getUserProfileForID(userUUID || '')
    const profileImageRes = mediaService.getMediaURLForID(userProfile.userData?.data.user_profile_object_key || '')

    const nameInitialArray = userProfile.userData?.data.user_name.split(' ') || ["Unknown"]

    return (
        <Popover open={assigneePopoverOpen} onOpenChange={setAssigneePopoverOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-expanded={assigneePopoverOpen}
                            className="rounded-full p-0 h-10 w-10 flex items-center justify-center"
                        >
                            {userProfile.userData?.data ? (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src={profileImageRes.mediaData?.url || ""}
                                        alt="Profile icon"
                                    />
                                    <AvatarFallback>
                                        {nameInitialArray[0][0].toUpperCase() +
                                            (nameInitialArray.length > 1 ? nameInitialArray[1][0].toUpperCase() : '')}
                                    </AvatarFallback>
                                </Avatar>
                            ) : (
                                <UserCircle className="h-8 w-8 text-gray-400" />
                            )}
                        </Button>
                    </PopoverTrigger>

                </TooltipTrigger>
                <TooltipContent>
                    <p>{t('assignee')}</p>
                </TooltipContent>
            </Tooltip>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={t('searchMemberPlaceholder')}/>
                    <CommandList>
                        <CommandEmpty>{t('noMemberFound')}</CommandEmpty>
                        <CommandGroup>
                            {taskInfo.taskData?.data.task_project.project_members.map((member) => (
                                <CommandItem
                                    key={member.user_uuid}
                                    value={member.user_uuid}
                                    onSelect={(currentValue) => {
                                        const selectedTaskAssignee = currentValue === userUUID ? undefined : currentValue
                                        assigneeUpdate(selectedTaskAssignee)
                                        setAssigneePopoverOpen(false)
                                    }}
                                >
                                    <span>{member.user_name}</span>
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            userUUID === member.user_uuid ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}