import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import profileService from "@/services/ProfileService.ts";
import { useState } from "react";
import TeamService from "@/services/TeamService.ts";
import { useToast } from "@/hooks/use-toast.ts";
import {useTranslation} from "react-i18next";
import {
 TOAST_UNKNOWN_ERROR,
} from "@/constants/dailog/const.tsx";

interface createTaskDialogProps {
  dialogOpenState: boolean;
  setOpenState: (state: boolean) => void;
}

const CreateTeamDialog: React.FC<createTaskDialogProps> = ({
  dialogOpenState,
  setOpenState,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const { toast } = useToast();
  const {t} = useTranslation()


  const teamAdminList = TeamService.getTeamListInAdminInfo();
  const selfUserProfile = profileService.getSelfUserProfile();


  let disableButton = true;

  if (inputValue) {
    disableButton = false;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async () => {

    try {
      await TeamService.CreateTeam({ team_name: inputValue });
      toast({
        title:  t('success'),
        description: t('createdNewTeam'),
      });

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
      toast({
        title: t('failure'),
        description: `${t('failedToCreateTeam')}: ${errorMessage}`,
      });
    }

    teamAdminList.mutate()
    selfUserProfile.userMutate()

    setInputValue("");

    closeModal(); // Close dialog after submission
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
          <DialogTitle>{t('createTeam')}</DialogTitle>
          <DialogDescription>{t('typeTeamName')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={t('typeTeamNamePlaceholder')}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={disableButton}>
            {t('createTeam')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamDialog;
