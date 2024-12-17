import React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Kanban, List, Paperclip, Pencil, Users} from "lucide-react";
import {useParams} from "react-router-dom";
import {ProjectTaskTable} from "@/components/project/projectTaskTable.tsx";
import {ProjectTaskKanban} from "@/components/project/projectTaskKanban.tsx";
import projectService from "@/services/ProjectService.ts";
import {ProjectAttachments} from "@/components/project/projectAttachments.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useDispatch} from "react-redux";
import {openEditProjectMemberPopup, openEditProjectNamePopup} from "@/store/slice/popupSlice.ts";
import {useTranslation} from "react-i18next";



const ProjectPage: React.FC = () => {

    const {projectId} = useParams()
    const {t} = useTranslation()

    const dispatch = useDispatch()

    const projectInfo = projectService.getProjectInfo(projectId||'')

    return (
        <>
            <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex items-center justify-start space-x-2">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">{projectInfo.projectData?.data.project_name}</h2>

                    </div>
                    {(projectInfo.projectData?.data.project_is_admin||false) && <div>

                        <Button size='icon' variant='ghost' onClick={()=>{dispatch(openEditProjectNamePopup({projectId:projectId||''}))}}>

                            <Pencil/>
                        </Button>

                        <Button size='icon' variant='ghost' onClick={()=>{dispatch(openEditProjectMemberPopup({projectId:projectId||''}))}}>

                            <Users/>
                        </Button>
                    </div>}

                </div>


                {projectId && <Tabs defaultValue="list" className="w-full ">
                    <TabsList>
                        <TabsTrigger value="list">
                            <List className='h-4 w-4 mr-2'/>{t('list')}
                        </TabsTrigger>
                        <TabsTrigger value="kanban">
                        <Kanban className='h-4 w-4 mr-2'/>{t('board')}
                        </TabsTrigger>
                        <TabsTrigger value="attachments">
                            <Paperclip className='h-4 w-4 mr-2'/>{t('attachments')}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="list" className='p-4'><ProjectTaskTable projectId={projectId}/></TabsContent>
                    <TabsContent value="kanban" className='p-4'><ProjectTaskKanban projectId={projectId}/></TabsContent>
                    <TabsContent value="attachments" className='p-4'><ProjectAttachments projectId={projectId}/></TabsContent>

                </Tabs>}


            </div>

        </>
    );
};

export default ProjectPage;
