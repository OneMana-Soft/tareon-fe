import {Separator} from "@/components/ui/separator.tsx";
import TaskComment from "@/components/rightSideBar/taskComment.tsx";
import {CommentInfoInterface} from "@/services/TaskService.ts";

interface TaskCommentSectionProp {
    comments?: CommentInfoInterface[];
    isProjectAdmin?: boolean;
    userUUID?: string;
    taskUUID: string;
}

export const TaskCommentSection = ({comments, isProjectAdmin, userUUID, taskUUID}: TaskCommentSectionProp) => {


    return (
        // <div className='mb-4'>
        //     <Label>{t('comments')}
        //         (<span>{taskInfo.taskData?.data?.task_comments ? taskInfo.taskData?.data.task_comments.length : '0'}</span>)</Label>
        // </div>

    <div>
        {comments && comments
            .map((commentsInfo) => {
                return (<div className='pl-4 pr-4' key={commentsInfo.comment_uuid}>
                    <Separator orientation='horizontal'/>
                    <TaskComment
                        commentInfo={commentsInfo} taskUUID={taskUUID}
                        isOwner={userUUID == commentsInfo.comment_created_by.user_uuid}
                        isAdmin={isProjectAdmin || false}
                    />
                </div>)
            })}
    </div>
)
}