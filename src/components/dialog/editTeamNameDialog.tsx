import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {useEffect, useState} from "react";
import { useToast } from "@/hooks/use-toast.ts";
import {
 TOAST_UNKNOWN_ERROR,
} from "@/constants/dailog/const.tsx";
import teamService from "@/services/TeamService.ts";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import {useTranslation} from "react-i18next";

interface createTaskDialogProps {
  dialogOpenState: boolean;
  setOpenState: (state: boolean) => void;
  teamId: string;
}

const EditTeamNameDialog: React.FC<createTaskDialogProps> = ({
  dialogOpenState,
  setOpenState,
    teamId
}) => {
  const [teamName, setTeamName] = useState<string>("");
  const { toast } = useToast();
  const {t} = useTranslation()

  const teamInfo = teamService.getTeamInfo(teamId)

  useEffect(() => {

    if(teamInfo.teamData?.data.team_name){
      setTeamName(teamInfo.teamData?.data.team_name)
    }

  }, [teamInfo.teamData?.data.team_name]);

  let disableButton = true;

  if (teamName) {
    disableButton = false;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(event.target.value);
  };

  const handleSubmit = async () => {

    try{
      await teamService.updateTeamName({
        team_name: teamName,
        team_uuid: teamId
      });

      toast({
        title: t('success'),
        description: t('updateTeamName'),
      });

      setTeamName("");

      closeModal(); // Close dialog after submission

    }catch (e) {

      const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
      toast({
        title: t('failure'),
        description: `${t('failedToUpdate')}: ${errorMessage}`,
        variant: "destructive",
      });

    }

    await teamInfo.Mutate();

  };

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
            {t('changeTeamName')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            {
              <div className="grid gap-2 mb-4">
                <Label htmlFor="name">{t('teamName')}:</Label>
                <Input
                  id="name"
                  value={teamName}
                  onChange={handleInputChange}
                  placeholder={t('enterTeamNamePlaceholder')}
                  autoFocus
                />
              </div>
            }

          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={disableButton}>
            {t('update')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeamNameDialog;
