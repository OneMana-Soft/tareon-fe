import {
    TableCell,
} from "@/components/ui/table"

import  {
    OpenSearchAttachmentInterface,

} from "@/services/SearchService.ts";
import projectService from "@/services/ProjectService.ts";
import mediaService from "@/services/MediaService.ts";

interface SearchAttachmentRowInterface {
    searchAttachmentInfo ?: OpenSearchAttachmentInterface
    navigateToProject: (id: string) => void
    navigateToTeam: (id: string) => void
    downloadFile: (id: string, fileName: string) => void
}

export function SearchProjectAttachmentRow({searchAttachmentInfo, navigateToProject, navigateToTeam, downloadFile}:SearchAttachmentRowInterface) {


    const projectInfo = projectService.getProjectInfo(searchAttachmentInfo?.attachment_project_id||'')
    const mediaObj = mediaService.getMediaURLForID(searchAttachmentInfo?.attachment_obj_key||'')


    return (
        <>
            <TableCell className="font-medium group cursor-pointer whitespace-nowrap overflow-ellipsis truncate" onClick={()=>{downloadFile(mediaObj.mediaData.url, searchAttachmentInfo?.attachment_file_name||'')}}>

                <span
                    className="group-hover:underline mr-2"
                >
                    {searchAttachmentInfo?.attachment_file_name}
                </span>

            </TableCell>

            <TableCell className="font-medium group cursor-pointer whitespace-nowrap overflow-ellipsis truncate" onClick={()=>{navigateToProject(projectInfo.projectData?.data.project_uuid || '')}}>

                <span
                    className="group-hover:underline mr-2"
                >
                    {projectInfo.projectData?.data.project_name}
                </span>

            </TableCell>
            <TableCell className='text-left'>
                {"--"}
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
