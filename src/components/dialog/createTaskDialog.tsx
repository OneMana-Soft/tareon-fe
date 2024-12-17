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
import projectService, {
  ProjectInfoInterface,
} from "@/services/ProjectService.ts";
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
} from "@/components/ui/command.tsx";
import { format } from "date-fns";
import { useState } from "react";
import { UserProfileDataInterface } from "@/services/ProfileService.ts";
import MinimalTiptapTask from "@/components/textInput/textInput.tsx";
import { cn } from "@/lib/utils.ts";
import { isDateEmptyOrInvalid } from "@/utils/Helper";
import { Content } from "@tiptap/react";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store.ts";
import {
  addCreateTaskDialogPreviewFiles,
  addCreateTaskDialogUploadedFiles,
  deleteCreateTaskDialogPreviewFiles,
  removeCreateTaskUploadedFiles,
  updateCreateTaskDialogDescriptionInputText,
  updateCreateTaskDialogNameInputText,
  updateCreateTaskDialogPreviewFiles,
  updateCreateTaskDialogProjectUUIDInputText,
  updateCreateTaskDialogUserUUIDInputText,
} from "@/store/slice/createTaskDailogSlice.ts";
import mediaService, {
  ATTACHMMENT_UPLOAD_FOR_ALL_PROJECT,
  AttachmentMediaReq,
  UploadFileInterfaceRes,
} from "@/services/MediaService.ts";
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalenderIcon,
  X,
} from "lucide-react";
import AttachmentIcon from "@/components/attachmentIcon/attachmentIcon.tsx";
import TaskService, { CreateTaskInterface } from "@/services/TaskService";
import { priorities, prioritiesInterface } from "@/components/task/data";
import {TOAST_UNKNOWN_ERROR} from "@/constants/dailog/const.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import {useTranslation} from "react-i18next";
import {mutate} from "swr";


interface createTaskDialogProps {
  dialogOpenState: boolean;
  setOpenState: (state: boolean) => void;
}

export interface FilePreview {
  key: number;
  fileName: string;
  progress: number;
  cancelSource: CancelTokenSource;
}

const CreateTaskDialog: React.FC<createTaskDialogProps> = ({
  dialogOpenState,
  setOpenState,
}) => {

  const [popOpenProjectName, setPopOpenProjectName] = useState(false);

  const [popOpenUserName, setPopOpenUserName] = useState(false);

  const [popOpenPriority, setPopOpenPriority] = useState(false);
  const {t} = useTranslation()


  const [selectedProject, setSelectedProject] =
    useState<ProjectInfoInterface | null>(null);

  const [selectedUser, setSelectedUser] =
    useState<UserProfileDataInterface | null>(null);
  const projectsInfo = projectService.getTeamListInAdminInfo();

  const [selectedPriority, setSelectedPriority] = useState<
    prioritiesInterface | undefined
  >(priorities[1]);

  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);

  const [taskLabel, setTaskLabel] = useState("");

  const { toast } = useToast();

  const dispatch = useDispatch();

  const dialogInputState = useSelector(
    (state: RootState) => state.createTaskDialog.dialogInputState
  );

  if (
    projectsInfo.projectData?.data &&
    dialogInputState.projectUUID &&
    (selectedProject == null ||
      selectedProject.project_uuid != dialogInputState.projectUUID)
  ) {
    setSelectedProject(
      projectsInfo.projectData?.data.find(
        (priority) => priority.project_uuid === dialogInputState.projectUUID
      ) || null
    );
  }

  if (
    selectedProject &&
    projectsInfo.projectData?.data &&
    dialogInputState.assigneeUUID &&
    (selectedUser == null ||
      selectedUser.user_uuid != dialogInputState.assigneeUUID)
  ) {
    setSelectedUser(
      selectedProject.project_members.find(
        (priority) => priority.user_uuid === dialogInputState.assigneeUUID
      ) || null
    );
  }

  let disableButton = true;

  if (
    dialogInputState.taskName &&
    dialogInputState.assigneeUUID &&
    dialogInputState.projectUUID
  ) {
    disableButton = false;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const cancelToken = axios.CancelToken.source();
      const uniqueNum = Date.now();

      dispatch(
        addCreateTaskDialogPreviewFiles({
          filesUploaded: {
            key: uniqueNum,
            fileName: file.name,
            progress: 0,
            cancelSource: cancelToken,
          },
          projectUUID: dialogInputState.projectUUID,
        })
      );

      const config: AxiosRequestConfig = {
        cancelToken: cancelToken.token,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / (progressEvent.total || 100)) * 100
          );

          dispatch(
            updateCreateTaskDialogPreviewFiles({
              progress: progress,
              key: uniqueNum,
              projectUUID: dialogInputState.projectUUID,
            })
          );
        },
      };
      const res = mediaService.uploadMedia(
        file,
        selectedProject?.project_uuid || ATTACHMMENT_UPLOAD_FOR_ALL_PROJECT,
        config
      );
      res.then((res) => {
        const uploadMediaRes: UploadFileInterfaceRes = res.data;

        dispatch(
          addCreateTaskDialogUploadedFiles({
            filesUploaded: {
              fileName: file.name,
              key: uniqueNum,
              url: uploadMediaRes.object_name,
            },
            projectUUID: dialogInputState.projectUUID,
          })
        );
      });
      res.catch((error) => {
        dispatch(
          deleteCreateTaskDialogPreviewFiles({
            key: uniqueNum,
            projectUUID: dialogInputState.projectUUID,
          })
        );

        console.error("error while uploading file: ", file.name, error);
      });
    }
  };

  const removePreviewFile = (key: number) => {
    dispatch(
      deleteCreateTaskDialogPreviewFiles({
        key,
        projectUUID: dialogInputState.projectUUID,
      })
    );
    dispatch(
      removeCreateTaskUploadedFiles({
        key,
        projectUUID: dialogInputState.projectUUID,
      })
    );
  };

  const handleTaskNameInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      updateCreateTaskDialogNameInputText({ taskName: event.target.value })
    );
  };

  const handleLabelInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTaskLabel(event.target.value.trim());
  };

  const handleCreateTask = async () => {
    const taskAttachments = [] as AttachmentMediaReq[];
    const createTaskConfig = {} as CreateTaskInterface;

    for (const attach of dialogInputState.filesUploaded[
      dialogInputState.projectUUID
    ]) {
      taskAttachments.push({
        attachment_file_name: attach.fileName,
        attachment_obj_key: attach.url,
        attachment_uuid: ''
      });
    }

    createTaskConfig.task_assignee_uuid = selectedUser?.user_uuid;
    createTaskConfig.task_name = dialogInputState.taskName;
    createTaskConfig.task_description = dialogInputState.taskDescription;
    createTaskConfig.task_project_uuid = dialogInputState.projectUUID;
    createTaskConfig.task_attachments = taskAttachments;
    createTaskConfig.task_label = taskLabel;

    if (dueDate && !isDateEmptyOrInvalid(dueDate)) {
      createTaskConfig.task_due_date = dueDate.toISOString();
    }
    if (startDate && !isDateEmptyOrInvalid(startDate)) {
      createTaskConfig.task_start_date = startDate.toISOString();
    }

    try {
      await TaskService.createTask(createTaskConfig);

      toast({
        title: t('success'),
        description: t('createdNewTask'),
      });

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
      toast({
        title: t('failure'),
        description: `${t('failedToCreateTask')}: ${errorMessage}`,
      });
    }


    await mutate(
        key => typeof key === 'string' && key.startsWith('/api/user/assignedTaskList')
    )

    await mutate(
        key => typeof key === 'string' && key.startsWith(`/api/project/taskList/${dialogInputState.projectUUID}`)
    )

    closeModal();


  };



  function closeModal() {
    setOpenState(false);
  }

  return (
    <Dialog onOpenChange={closeModal} open={dialogOpenState}>
      {/*<DialogTrigger asChild>*/}
      {/*    <Button variant="secondary">Save</Button>*/}
      {/*</DialogTrigger>*/}
      <DialogContent className="sm:max-w-fit min-w-[50vw] min-h-[60vh]">
        <DialogHeader>
          <DialogTitle>{t('createTask')}</DialogTitle>
          <DialogDescription>{t('createNewTask')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2 mb-2">
            <Label htmlFor="task_name">{t('taskName')}:</Label>
            <Input
              id="task_name"
              value={dialogInputState.taskName}
              onChange={handleTaskNameInputChange}
              placeholder={t('enterTaskName')}
              autoFocus
            />
          </div>
          <div className="grid gap-2 mb-2">
            {projectsInfo.projectData?.data && (
              <div className="flex items-center space-x-4">
                <p className="text-sm">{t('project')}:</p>
                <Popover
                  open={popOpenProjectName}
                  onOpenChange={setPopOpenProjectName}
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" className=" justify-start">
                      {selectedProject ? (
                        <>
                          {/*<selectedTeam.icon className="mr-2 h-4 w-4 shrink-0"/>*/}
                          {selectedProject.project_name}
                          {" (" + selectedProject.project_team.team_name + ")"}
                        </>
                      ) : (
                        <>{t('selectProject')}</>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                      <CommandInput placeholder="Select project..." />
                      <CommandList>
                        <CommandEmpty>{t('noProjectFound')}</CommandEmpty>
                        <CommandGroup>
                          {projectsInfo.projectData?.data.map((project) => (
                            <CommandItem
                              key={project.project_uuid}
                              value={project.project_uuid}
                              onSelect={(value) => {
                                dispatch(
                                  updateCreateTaskDialogProjectUUIDInputText({
                                    projectUUID: value,
                                  })
                                );
                                setPopOpenProjectName(false);
                              }}
                            >

                              <span>
                                {project.project_name}
                                <span className="ml-2">
                                  {"(" + project.project_team.team_name + ")"}
                                </span>
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}
            {selectedProject && (
              <div className="flex space-x-10">
                <div className="flex items-center space-x-4">
                  <p className="text-sm">For: </p>
                  <Popover
                    open={popOpenUserName}
                    onOpenChange={setPopOpenUserName}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="outline" className=" justify-start">
                        {selectedUser ? (
                          <>
                            {/*<selectedTeam.icon className="mr-2 h-4 w-4 shrink-0"/>*/}
                            {selectedUser.user_name}
                          </>
                        ) : (
                          <>{t('selectMember')}</>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" side="right" align="start">
                      <Command>
                        <CommandInput placeholder={t('selectProject')} />
                        <CommandList>
                          <CommandEmpty>{t('noMemberFound')}</CommandEmpty>
                          <CommandGroup>
                            {selectedProject.project_members.map((member) => (
                              <CommandItem
                                key={member.user_uuid}
                                value={member.user_uuid}
                                onSelect={(value) => {
                                  dispatch(
                                    updateCreateTaskDialogUserUUIDInputText({
                                      userUUID: value,
                                    })
                                  );

                                  setPopOpenUserName(false);
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

                                <span>{member.user_name}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm">{t('priority')}: </p>
                  <Popover
                    open={popOpenPriority}
                    onOpenChange={setPopOpenPriority}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="outline" className=" justify-start">
                        {selectedPriority ? (
                          <>
                            {/*<selectedTeam.icon className="mr-2 h-4 w-4 shrink-0"/>*/}
                            <selectedPriority.icon className="mr-2 h-4 w-4 text-muted-foreground" />

                            {selectedPriority.label}
                          </>
                        ) : (
                          <>{t('selectPriority')}</>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" side="right" align="start">
                      <Command>
                        <CommandInput placeholder={t('selectPriority')} />
                        <CommandList>
                          <CommandEmpty>{t('"noPriorityFound')}</CommandEmpty>
                          <CommandGroup>
                            {priorities.map((member) => (
                              <CommandItem
                                key={member.value}
                                value={member.value}
                                onSelect={(value) => {
                                  const p: prioritiesInterface | undefined =
                                    priorities.find((p) => p.value == value);

                                  setSelectedPriority(p);

                                  setPopOpenPriority(false);
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

                                <member.icon className="mr-2 h-4 w-4 text-muted-foreground" />

                                <span>{member.label}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center space-x-4">
                  <Label htmlFor="task_label">{t('label')}:</Label>
                  <Input
                    id="task_label"
                    value={taskLabel}
                    onChange={handleLabelInputChange}
                    placeholder={t('labelPlaceHolder')}
                    autoFocus
                  />
                </div>
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">{t('description')}</Label>
            <MinimalTiptapTask
              throttleDelay={3000}
              className={cn("h-full min-h-0 w-full rounded-xl")}
              editorContentClassName="overflow-auto h-full"
              output="html"
              content={dialogInputState.taskDescription}
              placeholder={t('descriptionPlaceholder')}
              editable={true}
              editorClassName="focus:outline-none px-5 py-4 h-full"
              onChange={(content: Content) => {
                dispatch(
                  updateCreateTaskDialogDescriptionInputText({
                    taskDescription: content?.toString() || "",
                  })
                );
              }}
            />
          </div>
        </div>
        {selectedProject?.project_uuid && (
          <div>
            <Label htmlFor="file-upload" className="cursor-pointer">
              {t('attachFiles')}
            </Label>

            <Input
              type="file"
              key={
                (dialogInputState.filePreview[dialogInputState.projectUUID] &&
                  dialogInputState.filePreview[dialogInputState.projectUUID]
                    .length) ||
                0
              }
              id="file-upload"
              multiple
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <div className="flex flex-wrap">
              {dialogInputState.filePreview[dialogInputState.projectUUID] &&
                dialogInputState.filePreview[dialogInputState.projectUUID].map(
                  (file, index) => {
                    return (
                      <div
                        key={index}
                        className="flex relative justify-center items-center m-1 mt-2 p-1 border rounded-xl border-gray-700"
                      >
                        <button
                          className="absolute top-0 right-0 p-1 -mt-2 -mr-2 bg-background rounded-full border-gray-700 border"
                          onClick={() => removePreviewFile(file.key)}
                        >
                          <X height="1rem" width="1rem" />
                        </button>
                        <div>
                          <AttachmentIcon fileName={file.fileName} />
                        </div>
                        <div className="flex-col">
                          <div className="text-ellipsis truncate max-w-40 text-xs ">
                            {file.fileName}
                          </div>
                          <div className="text-ellipsis truncate max-w-40 text-xs ">
                            uploading: {file.progress}%
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
            <div className="flex space-x-8">
              <div className='relative'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      " pl-3 text-left font-normal mt-4",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>{t('startDate')}</span>
                    )}
                    <CalenderIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {startDate && (
                  <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -right-4 top-0 transform rounded-full"
                      onClick={()=>{setStartDate(undefined)}}
                  >
                    <X className="h-1 w-1" />
                  </Button>
              )}
              </div>
              <div className='relative'>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      " pl-3 text-left font-normal mt-4",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    {dueDate ? format(dueDate, "PPP") : <span>{t('dueDate')}</span>}
                    <CalenderIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
                {dueDate && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -right-4 top-0 transform rounded-full"
                        onClick={()=>{setDueDate(undefined)}}
                    >
                      <X className="h-1 w-1" />
                    </Button>
                )}
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleCreateTask}
            disabled={disableButton}
          >
            {t('createTask')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
