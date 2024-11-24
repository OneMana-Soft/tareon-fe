import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import profileService from "@/services/ProfileService.ts";
import { useState } from "react";
import TeamService from "@/services/TeamService.ts";
import { useToast } from "@/hooks/use-toast.ts";
import { ToastAction } from "@/components/ui/toast.tsx";
import {
  TOAST_TITLE_FAILURE,
  TOAST_TITLE_SUCCESS,
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

  const teamAdminList = TeamService.getTeamListInAdminInfo();

  let disableButton = true;

  if (inputValue) {
    disableButton = false;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async () => {
    const res = await TeamService.CreateTeam({ team_name: inputValue });

    if (res.status != 200) {
      toast({
        title: TOAST_TITLE_FAILURE,
        description: "Failed to create new team",
      });

      return;
    }

    toast({
      title: TOAST_TITLE_SUCCESS,
      description: "Created new team",
    });

    await teamAdminList.mutate();

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
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>Please type team name</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type team name..."
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={disableButton}>
            Create Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamDialog;
