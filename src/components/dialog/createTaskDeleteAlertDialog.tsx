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
import {
  TOAST_TITLE_FAILURE,
  TOAST_TITLE_SUCCESS, TOAST_UNKNOWN_ERROR,
} from "@/constants/dailog/const.tsx";
import taskService from "@/services/TaskService.ts";
import {useDispatch} from "react-redux";

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

  const handleDeleteTask = async () => {
    try{
      await taskService.deleteTask(taskUUID)
      toast({
        title: TOAST_TITLE_SUCCESS,
        description: "Deleted Task",
      });

    }catch (e) {

      const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
      toast({
        title: TOAST_TITLE_FAILURE,
        description: `Failed to delete task: ${errorMessage}`,
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
          <DialogTitle>Alert</DialogTitle>
          <DialogDescription>Deleting task</DialogDescription>
        </DialogHeader>
        {hasSubTasks ?
            <div>
              Task has undeleted sub tasks. Until all sub task are deleted this task can be trackable/opened again
            </div>
            :
            <div>
              Are you sure you want to delete
            </div>
        }
        <DialogFooter className='flex justify-between'>
            <Button onClick={closeModal} variant='outline'>
              Cancel
            </Button>
            <Button onClick={handleDeleteTask} variant='destructive'>
              Delete Task
            </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDeleteAlertDialog;
