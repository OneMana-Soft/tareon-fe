import * as React from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Tabs, TabsList, TabsContent, TabsTrigger} from "@/components/ui/tabs.tsx";
import {MyCompletedTaskList} from "@/components/task/myCompletedTaskList.tsx";
import taskService from "@/services/TaskService.ts";
import { TOAST_UNKNOWN_ERROR} from "@/constants/dailog/const.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {MyOverdueTaskList} from "@/components/task/myOverdueTaskList.tsx";
import {MyUpcomingTaskList} from "@/components/task/myUpcommingTaskList.tsx";
import profileService from "@/services/ProfileService.ts";
import mediaService from "@/services/MediaService.ts";
import {getNameInitials} from "@/utils/Helper.ts";
import {useTranslation} from "react-i18next";

const HomePage: React.FC = () => {

    const userInfo = profileService.getSelfUserProfile()
    const profileMedia = mediaService.getMediaURLForID(userInfo.userData?.data.user_profile_object_key||'')
    const nameIntial = getNameInitials(userInfo.userData?.data.user_name||'')
    const {t} = useTranslation()

    const { toast } = useToast();

    const handleUpdateTaskStatus = async (taskStatus: string, taskId: string, projectId: string)=>{
        try {
            await taskService.updateTaskStatus({task_status: taskStatus, task_uuid: taskId, task_project_uuid: projectId})

            toast({
                title: t('success'),
                description: t('updatedTaskStatus'),
            });

        } catch (e) {

            const errorMessage = e instanceof Error
                ? e.message
                : TOAST_UNKNOWN_ERROR;

            toast({
                title: t('failure'),
                description: `${t('failedToUpdateTaskStatus')}: ${errorMessage}`,
                variant: "destructive",
            })

            return

        }
    }


    return (
        <div className='h-full flex items-center justify-center'>
            <Card className="">
                <CardHeader>
                    <CardTitle className='flex text-center justify-start items-center'>
                        <Avatar className="h-8 w-8 mr-4">
                            <AvatarImage src={profileMedia.mediaData?.url||''} alt="@shadcn" />
                            <AvatarFallback>{nameIntial}</AvatarFallback>
                        </Avatar>{" "}

                        {t('myTasks')}</CardTitle>
                    {/*<CardDescription>Deploy your new project in one-click.</CardDescription>*/}
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="completed" className="w-[40rem]">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="upcoming">{t('upcoming')}</TabsTrigger>
                            <TabsTrigger value="overdue">{t('overdue')}</TabsTrigger>
                            <TabsTrigger value="completed">{t('completed')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upcoming">
                            <Card>

                                <CardContent className="space-y-2">
                                    <MyUpcomingTaskList updateStatus={handleUpdateTaskStatus}/>
                                </CardContent>

                            </Card>
                        </TabsContent>
                        <TabsContent value="overdue">
                            <Card>

                                <CardContent className="space-y-2">
                                    <MyOverdueTaskList updateStatus={handleUpdateTaskStatus}/>
                                </CardContent>

                            </Card>
                        </TabsContent>
                        <TabsContent value="completed">
                            <Card>

                                <CardContent className="space-y-2">
                                    <MyCompletedTaskList updateStatus={handleUpdateTaskStatus}/>
                                </CardContent>

                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                {/*<CardFooter className="flex justify-between">*/}
                {/*   <></>*/}
                {/*</CardFooter>*/}
            </Card>
        </div>
    )
}

export default HomePage;
