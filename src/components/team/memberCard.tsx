import {useParams} from "react-router-dom";
import teamService from "@/services/TeamService.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {TOAST_UNKNOWN_ERROR} from "@/constants/dailog/const.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import MemberList from "@/components/team/memberList.tsx";
import AddTeamMemberCombobox from "@/components/team/addTeamMemberCombobox.tsx";
import {useTranslation} from "react-i18next";


interface MemberCardInterface {
    isAdmin: boolean
}

const MembersCard: React.FC<MemberCardInterface> = ({isAdmin}) => {

    const {teamId} = useParams()
    const teamMemberList = teamService.getTeamMemberListInfo(teamId || '')
    const {t} = useTranslation()

    const { toast } = useToast()

    const handleMakeAdmin = async (id: string) => {
        if(!id) return

        try {
            await teamService.addAdminTeamMember({team_uuid:teamId, member_uuid:id})
            toast({
                title: t('success'),
                description: t('addedAdmin'),
            });
            await teamMemberList.userMutate()

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
            toast({
                title: t('failure'),
                description: `${t('failedToAddAdminRole')}: ${errorMessage}`,
                variant: "destructive",
            });
        }
    }

    const handleRemoveAdmin = async (id: string) => {
        if(!id || !teamId) return

        try {
            await teamService.removeAdminRole(teamId, id)
            toast({
                title: t('success'),
                description: t('removeAdminRole'),
            });
            await teamMemberList.userMutate()

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
            toast({
                title: t('failure'),
                description: `${t('failedToRemoveAdminRole')}: ${errorMessage}`,
                variant: "destructive",
            });
        }
    }

    const handleAddMember = async (id: string) => {
        if(!id) return

        try {
            await teamService.addTeamMember({team_uuid:teamId, member_uuid:id})
            toast({
                title: t('success'),
                description: t('addedTeamMember'),
            });
            await teamMemberList.userMutate()

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
            toast({
                title: t('failure'),
                description: `${t('failedToAddTeamMember')}: ${errorMessage}`,
                variant: "destructive",
            });
        }
    }

    const handleRemoveMember = async (id: string) => {
        if(!id || !teamId) return

        try {
            await teamService.removeMember(teamId, id)
            toast({
                title: t('success'),
                description: t('removedTeamMember'),
            });
            await teamMemberList.userMutate()

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
            toast({
                title: t('failure'),
                description: `${t('failedToRemoveTeamMember')}: ${errorMessage}`,
                variant: "destructive",
            });
        }
    }

    return (

        <Card className="w-[30vw]">
            <CardHeader>
                <CardTitle>
                    {t('members')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col gap-y-6'>
                    <AddTeamMemberCombobox handleAddMember={handleAddMember}/>
                    <MemberList isAdmin={isAdmin} usersList={teamMemberList.teamData?.data.team_members||[]} handleMakeAdmin={handleMakeAdmin} handleRemoveAdmin={handleRemoveAdmin} handleRemoveMember={handleRemoveMember} />

                </div>
            </CardContent>

        </Card>

    );
};

export default MembersCard;
