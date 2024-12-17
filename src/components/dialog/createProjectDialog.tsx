import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useState } from "react";
import  { TeamInfoInterface } from "@/services/TeamService.ts";
import { useToast } from "@/hooks/use-toast.ts";
import {
   TOAST_UNKNOWN_ERROR,
} from "@/constants/dailog/const.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import teamService from "@/services/TeamService.ts";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import projectService from "@/services/ProjectService.ts";
import {useTranslation} from "react-i18next";
import profileService from "@/services/ProfileService.ts";

interface createTaskDialogProps {
  dialogOpenState: boolean;
  setOpenState: (state: boolean) => void;
}

const CreateProjectDialog: React.FC<createTaskDialogProps> = ({
  dialogOpenState,
  setOpenState,
}) => {
  const [projectName, setProjectName] = useState<string>("");
  const { toast } = useToast();
  const {t} = useTranslation()


  const [popOpen, setPopOpen] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState<TeamInfoInterface | null>(
    null
  );

  const selfUserProfile = profileService.getSelfUserProfile();
  const projectAdminList = projectService.getTeamListInAdminInfo();

  let disableButton = true;

  if (projectName && selectedTeam) {
    disableButton = false;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };

  const teamInfo = teamService.getTeamListInAdminInfo();

  const handleSubmit = async () => {

    try {

      await projectService.CreateProject({
        project_name: projectName,
        project_team_uuid: selectedTeam?.team_uuid,
      });

      toast({
        title: t('success'),
        description: t('createdNewProject'),
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
      toast({
        title: t('failure'),
        description: `${t('failedToCreateNewProject')}: ${errorMessage}`,
      });
    }

    projectAdminList.Mutate();
    selfUserProfile.userMutate()

    setProjectName("");

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
          <DialogTitle>{t('createProject')}</DialogTitle>
          <DialogDescription>
            {t('selectTeamCreateProject')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            {
              <div className="grid gap-2 mb-4">
                <Label htmlFor="name">Project Name:</Label>
                <Input
                  id="name"
                  value={projectName}
                  onChange={handleInputChange}
                  placeholder={t('enterProjectName')}
                  autoFocus
                />
              </div>
            }
            {teamInfo.teamData?.data && (
              <div className="flex items-center space-x-4">
                <p>Team:</p>
                <Popover open={popOpen} onOpenChange={setPopOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className=" justify-start">
                      {selectedTeam ? (
                        <>
                          {/*<selectedTeam.icon className="mr-2 h-4 w-4 shrink-0"/>*/}
                          {selectedTeam.team_name}
                        </>
                      ) : (
                        <>{t('selectTeam')}</>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                      <CommandInput placeholder="Change status..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {teamInfo.teamData?.data.map((team) => (
                            <CommandItem
                              key={team.team_uuid}
                              value={team.team_name}
                              onSelect={(value) => {
                                setSelectedTeam(
                                  teamInfo.teamData?.data.find(
                                    (priority) => priority.team_name === value
                                  ) || null
                                );
                                setPopOpen(false);
                              }}
                            >
                              {/*<status.icon*/}
                              {/*    className={cn(*/}
                              {/*        "mr-2 h-4 w-4",*/}
                              {/*        status.value === selectedTeam?.value*/}
                              {/*            ? "opacity-100"*/}
                              {/*            : "opacity-40"*/}
                              {/*    )}*/}
                              {/*/>*/}
                              <span>{team.team_name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={disableButton}>
            {t('createProject')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
