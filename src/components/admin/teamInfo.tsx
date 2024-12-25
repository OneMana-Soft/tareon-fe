import {useNavigate} from "react-router-dom";
import React from "react";
import {URL_TEAM} from "@/constants/routes/appNavigation.ts";
import {Trash, Users} from "lucide-react";
import {isZeroEpoch} from "@/utils/Helper.ts";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import {TeamInfoInterface} from "@/services/TeamService.ts";


interface TeamsInfoInterface {
    teamInfo: TeamInfoInterface
    handleDelete: (id: string)=>void
    handleUnDelete: (id: string) => void
    handleProjectMembers:(id: string) => void
}

const TeamInfo: React.FC<TeamsInfoInterface> = ({teamInfo, handleDelete, handleUnDelete, handleProjectMembers}) => {

    const navigate = useNavigate();
    const {t} = useTranslation()


    const handleProjectClick = () => {

        if(!teamInfo.team_is_member) return

        navigate(URL_TEAM+"/"+teamInfo.team_uuid)
    }

    return (

        <div className='flex justify-between h-16 items-center '>
            <div className={`max-w-sm overflow-hidden whitespace-nowrap overflow-ellipsis ${teamInfo.team_is_member?"hover:underline cursor-pointer":""}`} onClick={handleProjectClick}>
                {teamInfo.team_name }
            </div>
            <div className='flex items-center space-x-3.5'>
                <div>
                    <Button size='icon' variant='ghost' onClick={() => {
                        handleProjectMembers(teamInfo.team_uuid)
                    }}>

                        <Users/>
                    </Button>
                </div>
                <div>
                    {
                         (isZeroEpoch(teamInfo.team_deleted_at || '') ?
                            <Trash className='size-4 text-destructive cursor-pointer' onClick={() => {
                                handleDelete(teamInfo.team_uuid)
                            }}/> :
                            <Button variant='destructive' onClick={() => {
                                handleUnDelete(teamInfo.team_uuid)
                            }}>
                                {t('undelete')}
                            </Button>)
                    }
                </div>

            </div>
        </div>

    );
};

export default TeamInfo;
