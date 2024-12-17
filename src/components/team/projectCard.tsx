import {useParams} from "react-router-dom";
import teamService from "@/services/TeamService.ts";
import {Card, CardContent,  CardHeader, CardTitle} from "@/components/ui/card";
import ProjectsList from "@/components/team/projectList.tsx";
import { TOAST_UNKNOWN_ERROR} from "@/constants/dailog/const.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import ProjectService from "@/services/ProjectService.ts";
import {useTranslation} from "react-i18next";


interface ProjectsCardInterface {
    isAdmin: boolean
}

const ProjectsCard: React.FC<ProjectsCardInterface> = ({isAdmin}) => {

    const {teamId} = useParams()
    const teamProjectList = teamService.getTeamProjectListInfo(teamId || '')

    const { toast } = useToast()
    const {t} = useTranslation()


    const handleDelete = async (id: string) => {
        if(!id) return

        try {
            await ProjectService.DeleteProject(id)
            toast({
                title: t('success'),
                description:  t('deletedProject'),
            });
            await teamProjectList.userMutate()

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
            toast({
                title: t('failure'),
                description: `${t('failedToDeleteProject')}: ${errorMessage}`,
                variant: "destructive",
            });
        }
    }

    const handleUnDelete = async (id: string) => {
        if(!id) return

        try {
            await ProjectService.UnDeleteProject(id)
            toast({
                title: t('success'),
                description: t('UnDeleted project'),
            });
            await teamProjectList.userMutate()

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
            toast({
                title: t('failure'),
                description: `${t('failed to undelete project')}: ${errorMessage}`,
                variant: "destructive",
            });
        }
    }


    return (

                    <Card className="w-[30vw]">
                        <CardHeader>
                            <CardTitle>
                                {t('projects')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProjectsList isAdmin={isAdmin} handleDelete={handleDelete} handleUnDelete={handleUnDelete}/>
                        </CardContent>

                    </Card>

    );
};

export default ProjectsCard;
