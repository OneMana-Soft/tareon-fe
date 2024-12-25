import taskService from "@/services/TaskService.ts";
import TaskActivity from "@/components/rightSideBar/taskActivity.tsx";
import {openOtherUserProfilePopup} from "@/store/slice/popupSlice.ts";
import {useDispatch} from "react-redux";

interface  TaskActivitySectionProps {
    taskId: string
}

export default function TaskActivitySection({taskId}: TaskActivitySectionProps) {
    const activityList = taskService.getTaskActivityList(taskId)

    const dispatch = useDispatch()
    const openOtherUserProfile = (id: string) => {
        dispatch(openOtherUserProfilePopup({userId: id}))
    }
    return (

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-5 bottom-0 w-px bg-muted-foreground"/>

                {/* Activity items */}
                <div className="space-y-6">
                    {activityList.taskData?.data && activityList.taskData.data.task_activities.map((activity) => (
                        <div key={activity.activity_uuid} >
                            <TaskActivity taskActivity={activity} openOtherUserProfile={openOtherUserProfile}/>
                        </div>
                    ))}
                </div>
            </div>

    )
}

