import {
    TableCell,
} from "@/components/ui/table"

import  {
    OpenSearchProjectInterface,
} from "@/services/SearchService.ts";
import projectService from "@/services/ProjectService.ts";

interface SearchTaskRowInterface {
    searchProjectInfo ?: OpenSearchProjectInterface
    navigateToProject: (id: string) => void
    navigateToTeam: (id: string) => void
}

export function SearchProjectRow({searchProjectInfo, navigateToProject, navigateToTeam}:SearchTaskRowInterface) {

    const projectId = searchProjectInfo?.project_id || ''

    const projectInfo = projectService.getProjectInfo(projectId)


    return (
        <>
            <TableCell className="font-medium group cursor-pointer whitespace-nowrap overflow-ellipsis truncate" onClick={()=>{navigateToProject(projectInfo.projectData?.data.project_uuid || '')}}>

                <span
                    className="group-hover:underline mr-2"
                >
                    {projectInfo.projectData?.data.project_name}
                </span>

            </TableCell>

            <TableCell className='w-48 whitespace-nowrap overflow-ellipsis truncate group cursor-pointer' onClick={()=>{navigateToTeam(projectInfo.projectData?.data.project_team.team_uuid || '')}}>
                <span
                    className="group-hover:underline mr-2 "
                >
                    {projectInfo.projectData?.data.project_team.team_name}

                </span>
            </TableCell>
        </>
    );
}
