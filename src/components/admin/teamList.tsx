import {TeamInfoInterface} from "@/services/TeamService.ts";
import { useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import * as React from "react";
import { openEditTeamMemberPopup} from "@/store/slice/popupSlice.ts";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import TeamInfo from "@/components/admin/teamInfo.tsx";
import adminService from "@/services/AdminService.ts";


interface TeamsCardInterface {
    handleDelete: (id: string)=>void
    handleUnDelete: (id: string)=>void
}

const TeamList: React.FC<TeamsCardInterface> = ({handleDelete, handleUnDelete}) => {

    const [query, setQuery] = useState('')

    const dispatch = useDispatch()
    const {t} = useTranslation()


    const teamList = adminService.getAllTeamsList()

    const handleTeamMembers = (id: string) => {
        dispatch(openEditTeamMemberPopup({teamId: id}))
    }


    const filteredTeam =
        query === ''
            ? teamList.data?.data || [] as TeamInfoInterface[]
            : teamList.data?.data.filter((team) =>
                team.team_name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            ) || [] as TeamInfoInterface[]

    return (

        <>

                <Input
                    type="text"
                    placeholder={t('teamSearchPlaceholder')}
                    // className="w-full px-2 py-1 border-2 border-gray-300 rounded-full"
                    onChange={(event) => setQuery(event.target.value)}
                />

            <div className="h-[60vh] mt-4 pl-3 pr-3 channel-members-list flex flex-col overflow-y-auto">
                {filteredTeam?.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        {"No team found"}
                    </div>
                ) : (filteredTeam.map((team, i) => {


                    return (

                    <div key={(team.team_uuid)}>
                        <Separator orientation="horizontal" className={i ? 'invisible' : ''} />
                        <TeamInfo teamInfo={team} handleDelete={handleDelete} handleUnDelete={handleUnDelete}  handleProjectMembers={handleTeamMembers}/>
                        <Separator orientation="horizontal" className="" />

                    </div>
                    )
                }))}
            </div>
        </>

    );
};

export default TeamList;
