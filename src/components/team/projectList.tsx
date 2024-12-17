import {useParams} from "react-router-dom";
import teamService from "@/services/TeamService.ts";
import { useState} from "react";
import {ProjectInfoInterface} from "@/services/ProjectService.ts";
import {Input} from "@/components/ui/input.tsx";
import ProjectInfo from "@/components/team/projectInfo.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import * as React from "react";
import {openEditProjectMemberPopup} from "@/store/slice/popupSlice.ts";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";


interface ProjectsCardInterface {
    isAdmin: boolean
    handleDelete: (id: string)=>void
    handleUnDelete: (id: string)=>void
}

const ProjectsList: React.FC<ProjectsCardInterface> = ({handleDelete, handleUnDelete}) => {

    const {teamId} = useParams()
    const [query, setQuery] = useState('')

    const dispatch = useDispatch()
    const {t} = useTranslation()


    const teamProjectList = teamService.getTeamProjectListInfo(teamId || '')

    const handleProjectMembers = (id: string) => {
        dispatch(openEditProjectMemberPopup({projectId: id}))
    }


    const filteredProject =
        query === ''
            ? teamProjectList.teamData?.data.team_projects || [] as ProjectInfoInterface[]
            : teamProjectList.teamData?.data.team_projects.filter((project) =>
                project.project_name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            ) || [] as ProjectInfoInterface[]

    return (

        <>

                <Input
                    type="text"
                    placeholder={t('projectSearchPlaceholder')}
                    // className="w-full px-2 py-1 border-2 border-gray-300 rounded-full"
                    onChange={(event) => setQuery(event.target.value)}
                />

            <div className="h-[60vh] mt-4 pl-3 pr-3 channel-members-list flex flex-col overflow-y-auto">
                {filteredProject?.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        {"No project found"}
                    </div>
                ) : (filteredProject.map((project, i) => {


                    return (

                    <div key={(project.project_uuid)}>
                        <Separator orientation="horizontal" className={i ? 'invisible' : ''} />
                        <ProjectInfo projectInfo={project} handleDelete={handleDelete} handleUnDelete={handleUnDelete} isAdmin={teamProjectList.teamData?.data.team_is_admin||false} handleProjectMembers={handleProjectMembers}/>
                        <Separator orientation="horizontal" className="" />

                    </div>
                    )
                }))}
            </div>
        </>

    );
};

export default ProjectsList;
