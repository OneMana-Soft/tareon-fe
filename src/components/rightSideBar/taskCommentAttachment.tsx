import mediaService, {AttachmentMediaReq} from "@/services/MediaService"
import AttachmentIcon from "@/components/attachmentIcon/attachmentIcon.tsx";
import {useTranslation} from "react-i18next";

interface TaskCommentAttachmentProps {
    attachmentInfo: AttachmentMediaReq,


}

export default function TaskCommentAttachment({ attachmentInfo}: TaskCommentAttachmentProps) {
    const {t} = useTranslation()
    const mediaInfo = mediaService.getMediaURLForID(attachmentInfo.attachment_obj_key||'')

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

        </div>
    )
}
