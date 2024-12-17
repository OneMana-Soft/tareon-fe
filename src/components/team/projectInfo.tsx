import {useNavigate} from "react-router-dom";
import React from "react";
import {ProjectInfoInterface} from "@/services/ProjectService.ts";
import {URL_PROJECT} from "@/constants/routes/appNavigation.ts";
import {Trash, Users} from "lucide-react";
import {isZeroEpoch} from "@/utils/Helper.ts";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";


interface ProjectsInfoInterface {
    projectInfo: ProjectInfoInterface
    handleDelete: (id: string)=>void
    handleUnDelete: (id: string) => void
    handleProjectMembers:(id: string) => void
    isAdmin: boolean
}

const ProjectInfo: React.FC<ProjectsInfoInterface> = ({projectInfo, handleDelete, handleUnDelete, isAdmin, handleProjectMembers}) => {

    const navigate = useNavigate();
    const {t} = useTranslation()


    const handleProjectClick = () => {

        if(!projectInfo.project_is_member) return

        navigate(URL_PROJECT+"/"+projectInfo.project_uuid)
    }

    return (

        <div className='flex justify-between h-16 items-center '>
            <div className={`max-w-sm overflow-hidden whitespace-nowrap overflow-ellipsis ${projectInfo.project_is_member?"hover:underline cursor-pointer":""}`} onClick={handleProjectClick}>
                {projectInfo.project_name }
            </div>
            <div className='flex items-center space-x-3.5'>
                <div>
                    <Button size='icon' variant='ghost' onClick={() => {
                        handleProjectMembers(projectInfo.project_uuid)
                    }}>

                        <Users/>
                    </Button>
                </div>
                <div>
                    {
                        isAdmin && (isZeroEpoch(projectInfo.project_deleted_at || '') ?
                            <Trash className='size-4 text-destructive cursor-pointer' onClick={() => {
                                handleDelete(projectInfo.project_uuid)
                            }}/> :
                            <Button variant='destructive' onClick={() => {
                                handleUnDelete(projectInfo.project_uuid)
                            }}>
                                {t('undelete')}
                            </Button>)
                    }
                </div>

            </div>
        </div>

    );
};

export default ProjectInfo;
