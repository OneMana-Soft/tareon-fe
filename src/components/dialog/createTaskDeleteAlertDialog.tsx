import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast.ts";
import {  TOAST_UNKNOWN_ERROR,
} from "@/constants/dailog/const.tsx";
import taskService from "@/services/TaskService.ts";
import {useTranslation} from "react-i18next";

interface createTaskDeleteAlertDialogProps {
  dialogOpenState: boolean;
  setOpenState: (state: boolean) => void;
  taskUUID: string;
  hasSubTasks: boolean;

}

const CreateTaskDeleteAlertDialog: React.FC<createTaskDeleteAlertDialogProps> = ({
  dialogOpenState,
  setOpenState,
    taskUUID,
    hasSubTasks,
}) => {
  const { toast } = useToast();
  const taskInfo = taskService.getTaskInfo(taskUUID)
  const {t} = useTranslation()


  const handleDeleteTask = async () => {
    try{
      await taskService.deleteTask(taskUUID)
      toast({
        title: t('success'),
        description: t('Deleted Task'),
      });

    }catch (e) {

      const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
      toast({
        title: t('failure'),
        description: `${t('failedToDeleteTask')}: ${errorMessage}`,
        variant: "destructive",
      });

    }

    closeModal()
    taskInfo.mutate()
  };


  function closeModal() {
    setOpenState(false);
  }

  return (
    <Dialog onOpenChange={closeModal} open={dialogOpenState}>

      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>{t('alert')}</DialogTitle>
          <DialogDescription>{t('deletingTask')}</DialogDescription>
        </DialogHeader>
        {hasSubTasks ?
            <div>
              {t('taskDeleteHasSubTask')}
            </div>
            :
            <div>
              {t('deleteConfirmation')}
            </div>
        }
        <DialogFooter className='flex justify-between'>
            <Button onClick={closeModal} variant='outline'>
              {t('cancel')}
            </Button>
            <Button onClick={handleDeleteTask} variant='destructive'>
              {t('deleteTask')}
            </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDeleteAlertDialog;
