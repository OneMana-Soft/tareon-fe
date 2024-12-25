import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import * as React from "react";
import {useTranslation} from "react-i18next";
import teamService from "@/services/TeamService.ts";
import adminService from "@/services/AdminService.ts";
import MemberContent from "@/components/team/memberContent.tsx";

interface createTaskDialogProps {
  dialogOpenState: boolean;
  setOpenState: (state: boolean) => void;
  teamId: string;
}

const TeamMemberDialog: React.FC<createTaskDialogProps> = ({
  dialogOpenState,
  setOpenState,
    teamId
}) => {

  const teamInfo = teamService.getTeamInfo(teamId)
  const selfProfile = adminService.getSelfAdminProfile()

  const {t} = useTranslation()

  function closeModal() {
    setOpenState(false);
  }

  return (
    <Dialog onOpenChange={closeModal} open={dialogOpenState}>
      {/*<DialogTrigger asChild>*/}
      {/*    <Button variant="secondary">Save</Button>*/}
      {/*</DialogTrigger>*/}
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>{teamInfo.teamData?.data.team_name}</DialogTitle>
          <DialogDescription>
            {t('updateTeamMembers')}
          </DialogDescription>
        </DialogHeader>
        <MemberContent teamId={teamId||''} isAdmin={selfProfile.data?.data.is_admin || false}/>

        {/*<DialogFooter>*/}
        {/*  <Button onClick={handleSubmit} disabled={disableButton}>*/}
        {/*    Update*/}
        {/*  </Button>*/}
        {/*</DialogFooter>*/}
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberDialog;
