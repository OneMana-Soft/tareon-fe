import {Card, CardContent,  CardHeader, CardTitle} from "@/components/ui/card";
import { TOAST_UNKNOWN_ERROR} from "@/constants/dailog/const.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {useTranslation} from "react-i18next";
import TeamList from "@/components/admin/teamList.tsx";
import adminService from "@/services/AdminService.ts";


const TeamsCard = () => {

    const teamList = adminService.getAllTeamsList()

    const { toast } = useToast()
    const {t} = useTranslation()


    const handleDelete = async (id: string) => {
        if(!id) return

        try {
            await adminService.deleteTeam(id)
            toast({
                title: t('success'),
                description:  t('deletedTeam'),
            });
            await teamList.mutate()

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
            toast({
                title: t('failure'),
                description: `${t('failedToDeleteTeam')}: ${errorMessage}`,
                variant: "destructive",
            });
        }
    }

    const handleUnDelete = async (id: string) => {
        if(!id) return

        try {
            await adminService.unDeleteTeam(id)
            toast({
                title: t('success'),
                description: t('UnDeleted project'),
            });
            await teamList.mutate()

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
                                {t('teams')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TeamList handleDelete={handleDelete} handleUnDelete={handleUnDelete}/>
                        </CardContent>

                    </Card>

    );
};

export default TeamsCard;
