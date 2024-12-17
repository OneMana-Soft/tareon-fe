import { useState } from "react"
import { Button } from "@/components/ui/button"
import {ChevronDown,} from "lucide-react"
import mediaService, {AttachmentMediaReq} from "@/services/MediaService"
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { DropdownMenuContent } from "@/components/ui/dropdown-menu.tsx"
import {TOAST_TITLE_FAILURE} from "@/constants/dailog/const.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import AttachmentIcon from "@/components/attachmentIcon/attachmentIcon.tsx";
import {useTranslation} from "react-i18next";

interface ProjectAttachmentProps {
    attachmentInfo: AttachmentMediaReq,
    isAdmin: boolean
    handleRemoveAttachment: (id: string) => void
}

export default function ProjectAttachment({ attachmentInfo,  handleRemoveAttachment, isAdmin}: ProjectAttachmentProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false) // Track dropdown state
    const {t} = useTranslation()


    const mediaInfo = mediaService.getMediaURLForID(attachmentInfo.attachment_obj_key||'')


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
                    {t('download')}
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
                            <span>{t('download')}</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem className='hover:cursor-pointer' onClick={()=>{handleRemoveAttachment(attachmentInfo.attachment_obj_key||'')}}>
                            <span>{t('delete')}</span>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>}
            </div>
        </div>
    )
}
