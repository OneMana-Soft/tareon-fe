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
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import projectService from "@/services/ProjectService.ts";
import {useTranslation} from "react-i18next";

interface createTaskDialogProps {
  dialogOpenState: boolean;
  setOpenState: (state: boolean) => void;
  projectId: string;
}

const EditProjectNameDialog: React.FC<createTaskDialogProps> = ({
  dialogOpenState,
  setOpenState,
    projectId
}) => {
  const [projectName, setProjectName] = useState<string>("");
  const { toast } = useToast();
  const {t} = useTranslation()

  const projectInfo = projectService.getProjectInfo(projectId)

  useEffect(() => {

    if(projectInfo.projectData?.data.project_name){
      setProjectName(projectInfo.projectData?.data.project_name)
    }

  }, [projectInfo.projectData?.data.project_name]);

  let disableButton = true;

  if (projectName) {
    disableButton = false;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };

  const handleSubmit = async () => {

    try{
      await projectService.UpdateProjectName({
        project_name: projectName,
        project_uuid: projectId
      });

      toast({
        title: t('success'),
        description: t('updateProjectName'),
      });

      setProjectName("");

      closeModal(); // Close dialog after submission

    }catch (e) {

      const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
      toast({
        title: t('failure'),
        description: `${t('failedToUpdateProject')}: ${errorMessage}`,
        variant: "destructive",
      });

    }

    await projectInfo.Mutate();

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
          <DialogTitle>{projectInfo.projectData?.data.project_name}</DialogTitle>
          <DialogDescription>
            {t('changeProjectName')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            {
              <div className="grid gap-2 mb-4">
                <Label htmlFor="name">{t('projectName')}:</Label>
                <Input
                  id="name"
                  value={projectName}
                  onChange={handleInputChange}
                  placeholder={t('enterProjectName')}
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

export default EditProjectNameDialog;
