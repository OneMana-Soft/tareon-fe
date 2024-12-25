import teamService from "@/services/TeamService.ts";
import {useTranslation} from "react-i18next";
import {useToast} from "@/hooks/use-toast.ts";
import {TOAST_UNKNOWN_ERROR} from "@/constants/dailog/const.tsx";
import AddTeamMemberCombobox from "@/components/team/addTeamMemberCombobox.tsx";
import MemberList from "@/components/team/memberList.tsx";


interface memberContentProp {
    teamId: string
    isAdmin: boolean
}

const MemberContent: React.FC<memberContentProp> = ({teamId, isAdmin}) => {
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
        <div className='flex flex-col gap-y-6'>
            <AddTeamMemberCombobox handleAddMember={handleAddMember}/>
            <MemberList isAdmin={isAdmin} usersList={teamMemberList.teamData?.data.team_members || []}
                        handleMakeAdmin={handleMakeAdmin} handleRemoveAdmin={handleRemoveAdmin}
                        handleRemoveMember={handleRemoveMember}/>

        </div>
    )
}

export default MemberContent