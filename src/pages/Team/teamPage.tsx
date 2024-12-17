import React from "react";
import {Pencil} from "lucide-react";
import {useParams} from "react-router-dom";
import teamService from "@/services/TeamService.ts";
import ProjectsCard from "@/components/team/projectCard.tsx";
import MembersCard from "@/components/team/memberCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {openEditTeamNamePopup} from "@/store/slice/popupSlice.ts";
import {useDispatch} from "react-redux";




const TeamPage: React.FC = () => {

    const {teamId} = useParams()

    const teamInfo = teamService.getTeamInfo(teamId || '')

    const dispatch = useDispatch()

    return (
        <>
            <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex space-x-3 items-center justify-start ">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">{teamInfo.teamData?.data.team_name}</h2>

                    </div>

                    {teamInfo.teamData?.data.team_is_admin && <Button size='icon' variant='ghost' onClick={()=>{dispatch(openEditTeamNamePopup({teamId:teamId||''}))}}>

                        <Pencil/>
                    </Button>}
                </div>


                <div className='flex gap-x-6'>
                    <ProjectsCard isAdmin={teamInfo.teamData?.data.team_is_admin || false}/>
                    <MembersCard isAdmin={teamInfo.teamData?.data.team_is_admin || false}/>
                </div>


            </div>

        </>
    );
};

export default TeamPage;
