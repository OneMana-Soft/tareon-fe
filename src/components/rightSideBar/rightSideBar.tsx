import React, {useState, useEffect, Fragment, useRef, useCallback} from "react";
import {
  ArrowRightToLine,
  Calendar as CalenderIcon,
  Check,
  ChevronRight, ChevronsUpDown,
  CircleCheck,
  CirclePlus, EllipsisVertical,
  GripVertical, Maximize2, Minimize2, Trash, Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import MinimalTiptapTask from "../textInput/textInput";
import { Content } from "node_modules/@tiptap/core/dist/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input.tsx";
import { Transition } from "@headlessui/react";
import taskService, {CreateTaskInterface} from "@/services/TaskService.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";
import profileService, {UserProfileDataInterface} from "@/services/ProfileService.ts";
import {TOAST_UNKNOWN_ERROR} from "@/constants/dailog/const.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {isZeroEpoch} from "@/utils/Helper.ts";
import {useThrottle} from "@/components/minimal-tiptap/hooks/use-throttle.ts";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar.tsx";
import {prioritiesInterface, statuses, priorities} from "@/components/task/data.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import SubTaskAssignee from "@/components/rightSideBar/subTaskAssignee.tsx";
import ResizeableTextInput from "@/components/resizeableTextInput/resizeableTextInput.tsx";
import {openCreteTaskDeletePopup, openSideBarTaskInfo} from "@/store/slice/popupSlice.ts";
import TaskComment from "@/components/rightSideBar/taskComment.tsx";
import AttachmentIcon from "@/components/attachmentIcon/attachmentIcon.tsx";
import TaskAttachment from "@/components/rightSideBar/taskAttachment.tsx";
import {
  addTaskCommentPreviewFiles,
  addTaskCommentUploadedFiles,
  clearTaskCommentInputState,
  createOrUpdateTaskCommentBody,
  deleteTaskCommentPreviewFiles,
  ExtendedTaskCommentInputState,
  removeTaskCommentUploadedFiles,
  updateTaskCommentPreviewFiles
} from "@/store/slice/createTaskCommentSlice.ts";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import mediaService, {
  AttachmentMediaReq,
  ATTACHMMENT_UPLOAD_FOR_ALL_PROJECT,
  UploadFileInterfaceRes
} from "@/services/MediaService.ts";
import {
  addTaskInfoPreviewFiles, addTaskInfoUploadedFiles, clearTaskInfoInputState, deleteTaskInfoPreviewFiles,
  ExtendedTaskInfoInputState, removeTaskInfoUploadedFiles,
  updateTaskInfoPreviewFiles
} from "@/store/slice/TaskInfoSlice.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useTranslation} from "react-i18next";

interface OtherUserProfileModalProps {
  sideBarOpenState: boolean;
  setOpenState: (state: boolean) => void;
  taskUUID: string;
}

interface subTaskInterface {
  task_name: string
  task_due_date: Date|undefined
  task_start_date: Date|undefined
  task_assignee_uuid: string|undefined
}

const RightResizableSidebar: React.FC<OtherUserProfileModalProps> = ({
  sideBarOpenState,
  setOpenState,
  taskUUID,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(1000);
  const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);
  const {t} = useTranslation()


  const [isFullScreen, setIsFullScreen] = useState(false);

  const [assigneePopoverOpen, setAssigneePopoverOpen] = useState(false)
  const [taskAssignee, setTaskAssignee] = useState<UserProfileDataInterface|undefined>(undefined)
  const sideBarDivRef = useRef<HTMLDivElement>(null);
  const badgeSpanRef = useRef<HTMLSpanElement>(null);
  const userListDivRef = useRef<HTMLDivElement>(null);
  const newSubTaskDivRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const [subTaskInfo, setSubTaskInfo] = useState<subTaskInterface | undefined>(undefined);

  const [taskLabelWidth, setTaskLabelWidth] = useState(0)
  const [taskLabel, setTaskLabel] = useState(t('addLabel'));

  const [openTaskStatus, setOpenTaskStatus] = useState<boolean>(false)
  const [selectedStatus, setSelectedStatus] = useState<prioritiesInterface|undefined>(undefined)

  const [openTaskPriority, setOpenTaskPriority] = useState<boolean>(false)
  const [selectedPriority, setSelectedPriority] = useState<prioritiesInterface|undefined>(undefined)

  const { toast } = useToast();

  const throttledSetTaskLabel = useThrottle((value:React.ChangeEvent<HTMLInputElement>) => updateTaskLabel?.(value), 3000)


  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);

  const minWidth = 600;
  const maxWidth = 1000;
  const taskInfo = taskService.getTaskInfo(taskUUID||'');
  const userInfo = profileService.getSelfUserProfile()
  const ignoreClassList = ['task-name']

  const isAdmin = taskInfo.taskData?.data.task_project.project_is_admin || false

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      setSidebarWidth(window.innerWidth);
    } else {
      setSidebarWidth(1000); // Reset to default width
    }
  };

  const commentState = useSelector(
      (state: RootState) => state.createTaskComment.taskCommentInputState || {} as ExtendedTaskCommentInputState
  );

  const taskState = useSelector(
      (state: RootState) => state.TaskInfo.taskInfoInputState || {} as ExtendedTaskInfoInputState
  );

  const addAttachmentsToTask = async () => {
    try {
      // Get the latest state
      const currentTaskState = taskState[taskUUID];

      if (!currentTaskState || !currentTaskState.filesUploaded || currentTaskState.filesUploaded.length === 0) {
        return;
      }

      const taskAttachments = currentTaskState.filesUploaded.map(attach => ({
        attachment_file_name: attach.fileName,
        attachment_obj_key: attach.url,
        attachment_uuid: ''
      }));

      await taskService.addTaskAttachment({
        task_uuid: taskUUID,
        task_project_uuid: taskInfo.taskData?.data.task_project.project_uuid,
        task_attachments: taskAttachments
      });

      toast({
        title: t('success'),
        description: t('addAttachmentToTask', {count: taskAttachments.length}),
      });

      dispatch(clearTaskInfoInputState({taskUUID: taskUUID}));
      taskInfo.mutate();

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
      toast({
        title: t('failure'),
        description: `${t('failedToAddAttachmentToTask')}: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };
  const handleTaskFileUpload = async (
      e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files) return;

    const uploadPromises: Promise<AxiosResponse<UploadFileInterfaceRes>>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const cancelToken = axios.CancelToken.source();
      const uniqueNum = Date.now() + i; // Added i to prevent duplicate keys

      dispatch(
          addTaskInfoPreviewFiles({
            fileUploaded: {
              key: uniqueNum,
              fileName: file.name,
              progress: 0,
              cancelSource: cancelToken,
            },
            taskUUID: taskUUID,
          })
      );

      const config: AxiosRequestConfig = {
        cancelToken: cancelToken.token,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
              (progressEvent.loaded / (progressEvent.total || 100)) * 100
          );

          dispatch(
              updateTaskInfoPreviewFiles({
                progress: progress,
                key: uniqueNum,
                taskUUID: taskUUID,
              })
          );
        },
      };

      const uploadPromise = mediaService
          .uploadMedia(
              file,
              taskInfo.taskData?.data.task_project.project_uuid || ATTACHMMENT_UPLOAD_FOR_ALL_PROJECT,
              config
          )
          .then((res) => {
            const uploadMediaRes: UploadFileInterfaceRes = res.data;

            dispatch(
                addTaskInfoUploadedFiles({
                  filesUploaded: {
                    fileName: file.name,
                    key: uniqueNum,
                    url: uploadMediaRes.object_name,
                  },
                  taskUUID: taskUUID,
                })
            );
            return res;
          })
          .catch((error) => {
            dispatch(
                deleteTaskInfoPreviewFiles({
                  key: uniqueNum,
                  taskUUID: taskUUID,
                })
            );
            console.error("error while uploading file: ", file.name, error);
            throw error; // Re-throw to be caught by Promise.allSettled
          });

      uploadPromises.push(uploadPromise);
    }

    // Wait for all uploads to complete (success or failure)
    try {
      await Promise.allSettled(uploadPromises);
    } catch (error) {
      console.error("Error in upload batch:", error);
    }
  };

  const handleCommentFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const cancelToken = axios.CancelToken.source();
      const uniqueNum = Date.now();


      dispatch(
          addTaskCommentPreviewFiles({
            fileUploaded: {
              key: uniqueNum,
              fileName: file.name,
              progress: 0,
              cancelSource: cancelToken,
            },
            taskUUID: taskUUID,
          })
      );

      const config: AxiosRequestConfig = {
        cancelToken: cancelToken.token,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
              (progressEvent.loaded / (progressEvent.total || 100)) * 100
          );

          dispatch(
              updateTaskCommentPreviewFiles({
                progress: progress,
                key: uniqueNum,
                taskUUID: taskUUID,
              })
          );
        },
      };

      const res = mediaService.uploadMedia(
          file,
          taskInfo.taskData?.data.task_project.project_uuid || ATTACHMMENT_UPLOAD_FOR_ALL_PROJECT,
          config
      );
      res.then((res) => {
        const uploadMediaRes: UploadFileInterfaceRes = res.data;

        dispatch(
            addTaskCommentUploadedFiles({
              filesUploaded: {
                fileName: file.name,
                key: uniqueNum,
                url: uploadMediaRes.object_name,
              },
              taskUUID: taskUUID,
            })
        );
      });
      res.catch((error) => {

        dispatch(
            deleteTaskCommentPreviewFiles({
              key: uniqueNum,
              taskUUID: taskUUID,
            })
        );

        console.error("error while uploading file: ", file.name, error);
      });
    }
  };


  const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        const clickedElement = event.target as HTMLElement;
        const hasClass = ignoreClassList.some(className => clickedElement.classList.contains(className));
        if (
            sideBarDivRef.current &&
            !sideBarDivRef.current.contains(event.target as Node) &&
            (userListDivRef.current &&
            !userListDivRef.current.contains(event.target as Node) )&&
            !isResizing &&
           !hasClass &&
            !assigneePopoverOpen

        ) {
          closeSideBar();
        }

        if(
            newSubTaskDivRef.current &&
            !newSubTaskDivRef.current.contains(event.target as Node)
        ){
          const subtaskName = subTaskInfo?.task_name.trim() || ''
          if(subtaskName.length == 0) {
            setSubTaskInfo(undefined)
          } else {
            createSubTask()
          }

        }
      },
      [sideBarDivRef, isResizing, sideBarOpenState, subTaskInfo]
  );


  useEffect(() => {
    if (badgeSpanRef.current) {

      setTaskLabelWidth(badgeSpanRef.current.offsetWidth)
    }

  }, [taskLabel, taskUUID]);

  useEffect(() => {

    if(taskState[taskUUID] && taskState[taskUUID].filesPreview.length == taskState[taskUUID].filesUploaded.length) {
      addAttachmentsToTask()

    }

  }, [taskState]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [sideBarDivRef, handleClickOutside]);

  useEffect(() => {

    if(taskInfo.taskData?.data) {

        setTaskAssignee(taskInfo.taskData?.data.task_assignee||undefined)


      if(taskInfo.taskData.data.task_start_date && !isZeroEpoch(taskInfo.taskData.data.task_start_date)) {
        const dateObject = new Date(taskInfo.taskData.data.task_start_date);
        setStartDate(dateObject)
      }

      if(taskInfo.taskData.data.task_due_date && !isZeroEpoch(taskInfo.taskData.data.task_due_date)) {
        const dateObject = new Date(taskInfo.taskData.data.task_due_date);
        setDueDate(dateObject)
      }

      if(taskInfo.taskData.data.task_status) {
        const st  = statuses.find((status) => status.value == taskInfo.taskData?.data.task_status) || undefined
        setSelectedStatus(st)
      }

      if(taskInfo.taskData.data.task_priority) {
        const pt  = priorities.find((status) => status.value == taskInfo.taskData?.data.task_priority) || undefined
        setSelectedPriority(pt)
      }

      setTaskLabel(taskInfo.taskData.data.task_label || '')

    }

  }, [taskInfo.taskData?.data]);


  const startResizing = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const updateTaskAssignee = async (userUUID: string|undefined, taskId: string) => {
      try {

        await taskService.updateTaskAssignee({task_assignee_uuid: userUUID, task_uuid: taskId, task_project_uuid: taskInfo.taskData?.data.task_project.project_uuid});

        toast({
          title: t('success'),
          description: t('updateTaskAssignee'),
        });

        await taskInfo.mutate()

      } catch (e) {

        const errorMessage = e instanceof Error
            ? e.message
            : TOAST_UNKNOWN_ERROR;

        toast({
          title: t('failure'),
          description: `${t('failedToUpdateTaskAssignee')}: ${errorMessage}`,
          variant: "destructive",
        })

        return
      }
  }


  const createComment = async () => {

    if( commentState[taskUUID]?.commentBody.length == 0) return

    try {
      const commentAttachments = [] as AttachmentMediaReq[];


      for (const attach of commentState[taskUUID]?.filesUploaded||[]) {
        commentAttachments.push({
          attachment_file_name: attach.fileName,
          attachment_obj_key: attach.url,
          attachment_uuid: ''
        });
      }
      await taskService.createTaskComment({task_comment_body: commentState[taskUUID]?.commentBody, task_uuid: taskUUID, task_comment_attachments: commentAttachments})
      toast({
        title: t('success'),
        description: t('addedCommentToTask'),
      });

      await taskInfo.mutate()
      dispatch(clearTaskCommentInputState({taskUUID: taskUUID}))

    } catch (e) {

      const errorMessage = e instanceof Error
          ? e.message
          : TOAST_UNKNOWN_ERROR;

      toast({
        title: t('failure'),
        description: `${t('failedToAddCommentToTask')}: ${errorMessage}`,
        variant: "destructive",
      })

      return

    }
  }

  const handleChangeTaskLabel= React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskLabel(e.target.value.trim())
        throttledSetTaskLabel(e)
      },
      [throttledSetTaskLabel]
  )

  const updateTaskName = async (taskName: string, taskId: string) => {
    if(!taskName) {
      return
    }

    try {
      await taskService.updateTaskName({task_uuid:taskId, task_name:taskName, task_project_uuid:taskInfo.taskData?.data.task_project.project_uuid})

      toast({
        title: t('success'),
        description: t('updatedTask'),
      });

    }catch (e) {
      const errorMessage = e instanceof Error
          ? e.message
          : TOAST_UNKNOWN_ERROR;

      toast({
        title: t('failure'),
        description: `${t('failedToUpdateTaskName')}: ${errorMessage}`,
        variant: "destructive",
      })

      return
    }

  }

  const updateTaskLabel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const taskLabel = e.target.value;


    try {
      await taskService.updateTaskLabel({task_uuid:taskUUID, task_label:taskLabel, task_project_uuid:taskInfo.taskData?.data.task_project.project_uuid})

      toast({
        title: t('success'),
        description: t('updatedTaskLabel'),
      });

    } catch (e) {

      const errorMessage = e instanceof Error
          ? e.message
          : TOAST_UNKNOWN_ERROR;

      toast({
        title: t('failure'),
        description: `${t('failedToUpdateTaskLabel')}: ${errorMessage}`,
        variant: "destructive",
      })

      return

    }


  }

  const updateTaskStartDate = async (newStartDate: Date|undefined, taskId: string) => {

    try {
      await taskService.updateTaskStartDate({task_uuid:taskId, task_start_date: newStartDate ? newStartDate.toISOString() : '', task_project_uuid:taskInfo.taskData?.data.task_project.project_uuid})
      toast({
        title: t('success'),
        description: t('updateTaskStartDate'),
      });

    } catch (e) {
      const errorMessage = e instanceof Error
          ? e.message
          : TOAST_UNKNOWN_ERROR;

      toast({
        title: t('failure'),
        description: `${t('failedToUpdateTaskStartDate')}: ${errorMessage}`,
        variant: "destructive",
      })

      return
    }

    taskInfo.mutate()

  }

  const updateTaskDueDate = async (newDueDate: Date|undefined, taskId: string) => {

    try {
      await taskService.updateTaskDueDate({task_uuid:taskId, task_due_date: newDueDate ? newDueDate.toISOString() : '', task_project_uuid:taskInfo.taskData?.data.task_project.project_uuid})

      toast({
        title: t('success'),
        description: t('updatedTaskDueDate'),
      });

    } catch (e) {
      const errorMessage = e instanceof Error
          ? e.message
          : TOAST_UNKNOWN_ERROR;

      toast({
        title: t('failure'),
        description: `${t('failedToUpdatedTaskDueDate')}: ${errorMessage}`,
        variant: "destructive",
      })

      return
    }

    taskInfo.mutate()
  }

  const updateTaskStatus = async (taskStatus: string, taskId: string) => {

    try {
      await taskService.updateTaskStatus({task_status: taskStatus, task_uuid: taskId, task_project_uuid: taskInfo.taskData?.data.task_project.project_uuid})
      toast({
        title: t('success'),
        description: t('updatedTaskStatus'),
      });

    } catch (e) {

      const errorMessage = e instanceof Error
          ? e.message
          : TOAST_UNKNOWN_ERROR;

      toast({
        title: t('failure'),
        description: `${t('failedToUpdateTaskStatus')}: ${errorMessage}`,
        variant: "destructive",
      })

      return

    }

    await taskInfo.mutate()
  }

  const removeCommentPreviewFile = (key: number) => {
    dispatch(
        deleteTaskCommentPreviewFiles({
          key,
          taskUUID: taskUUID,
        })
    );
    dispatch(
        removeTaskCommentUploadedFiles({
          key,
          taskUUID: taskUUID,
        })
    );
  }

  const removeTaskPreviewFile = (key: number) => {
    dispatch(
        deleteTaskInfoPreviewFiles({
          key,
          taskUUID: taskUUID,
        })
    );
    dispatch(
        removeTaskInfoUploadedFiles({
          key,
          taskUUID: taskUUID,
        })
    );
  }


  const updateTaskPriority = async (taskPriority: string) => {

    try {
      await taskService.updateTaskPriority({task_priority: taskPriority, task_uuid: taskUUID, task_project_uuid: taskInfo.taskData?.data.task_project.project_uuid})
      toast({
        title: t('success'),
        description: t('updateTaskPriority'),
      });

    } catch (e) {
      const errorMessage = e instanceof Error
          ? e.message
          : TOAST_UNKNOWN_ERROR;

      toast({
        title: t('failure'),
        description: `${t('failedToUpdateTaskPriority')}: ${errorMessage}`,
        variant: "destructive",
      })

      return
    }

    await taskInfo.mutate()
  }

  const updateTaskDesc = async (taskDesc: string) => {


    if(taskDesc == taskInfo.taskData?.data.task_description || taskInfo.isLoading || (taskDesc == '' && taskInfo.taskData?.data.task_description == undefined)){
      return
    }

    try {
      await taskService.updateTaskDesc({task_description: taskDesc, task_uuid: taskUUID, task_project_uuid: taskInfo.taskData?.data.task_project.project_uuid})

      toast({
        title: t('success'),
        description: t('updatedTaskDesc'),
      });

    }catch (e) {
      const errorMessage = e instanceof Error
          ? e.message
          : TOAST_UNKNOWN_ERROR;

      toast({
        title: t('failure'),
        description: `${t('failedToUpdateTaskDesc')}: ${errorMessage}`,
        variant: "destructive",
      })

      return
    }

  }


  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    }
  };

  const handleUndeleteTask = async () => {
    try {
      await taskService.unDeleteTask(taskUUID)
      toast({
        title: t('success'),
        description: t('unrelatedTask'),
      });

    } catch (e) {
      const errorMessage = e instanceof Error
          ? e.message
          : TOAST_UNKNOWN_ERROR;

      toast({
        title: t('failure'),
        description: `${t('failedToUndeleteTask')}: ${errorMessage}`,
        variant: "destructive",
      })

      return
    }

    await taskInfo.mutate()
  }

  const createSubTask = async () => {

    const  postBody= {} as CreateTaskInterface

    postBody.task_project_uuid = taskInfo.taskData?.data.task_project.project_uuid
    postBody.task_uuid = taskUUID
    postBody.task_assignee_uuid = subTaskInfo?.task_assignee_uuid
    postBody.task_name = subTaskInfo?.task_name

    if(subTaskInfo?.task_start_date) {
      postBody.task_start_date = subTaskInfo?.task_start_date.toISOString()
    }

    if(subTaskInfo?.task_due_date) {
      postBody.task_due_date = subTaskInfo?.task_due_date.toISOString()
    }

    try {
      await taskService.createSubTask(postBody)

      toast({
        title: t('success'),
        description: t('createSubTask'),
      });

    }catch (e) {
      const errorMessage = e instanceof Error
          ? e.message
          : TOAST_UNKNOWN_ERROR;

      toast({
        title: t('failure'),
        description: `${t('failedToCreateSubTask')}: ${errorMessage}`,
        variant: "destructive",
      })

      return
    }

    setSubTaskInfo(undefined)
    await taskInfo.mutate()
  }

  function closeSideBar() {
    setOpenState(false);
  }

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);


  return (
          <Transition appear show={sideBarOpenState} as={Fragment}
                      enter="transform transition ease-out duration-300"
                      enterFrom="opacity-0 translate-x-full"
                      enterTo="opacity-100 translate-x-1"
                      leave="transform transition ease-in duration-200"
                      leaveFrom="opacity-100 translate-x-0"
                      leaveTo="opacity-0 translate-x-full"
                      ref={sideBarDivRef}>
      <div className="absolute top-0 right-0 h-full flex ">


        {/* Drag handle */}
        <div
          className={'w-1 cursor-col-resize border bg-border active:bg-gray-400 transition-colors'}
          onMouseDown={startResizing}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 p-1">
            <GripVertical className="h-6 w-6 text-gray-400" />
          </div>
        </div>

        {/* Sidebar content */}
        <div
          className={'bg-gray-50 dark:bg-gray-900 flex flex-col h-full'}
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Header section */}
          <div className="p-4 flex-shrink-0">
            <div className="flex mb-2">
              <div className="flex-1">
                {taskInfo.taskData?.data.task_status != 'done' && <Button variant="outline" onClick={()=>{updateTaskStatus('done', taskUUID)}} disabled={!isAdmin}>
                  <CircleCheck className="h-5 w-5" />
                  <span className="">{ t('markAsCompleted')}</span>
                </Button>}
              </div>
              <div className="flex justify-center items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullScreen}
                    className="mr-2"
                >
                  {isFullScreen ? (
                      <Minimize2 className="h-4 w-4" />
                  ) : (
                      <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                {isAdmin && isZeroEpoch(taskInfo.taskData?.data.task_deleted_at || '') && <DropdownMenu
                    open={isTaskDropdownOpen}
                    onOpenChange={(open) => setIsTaskDropdownOpen(open)}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        size='icon'
                    >
                      <EllipsisVertical className='h-3 w-3 text-muted-foreground'/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-fit">
                     <DropdownMenuItem className='hover:cursor-pointer '  onClick={()=>{dispatch(openCreteTaskDeletePopup({taskUUID:taskUUID, hasSubTasks:taskInfo.taskData?.data.task_sub_tasks != undefined}))}}>
                       <Trash
                           className="h-4 w-4 mr-2"
                       />Delete Task
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>}
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={closeSideBar}
                >
                  <ArrowRightToLine
                      className="h-3 w-3 "

                  />
                </Button>



              </div>
            </div>
            <Separator orientation="horizontal" />
          </div>

          {/* Main content - scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {taskInfo.taskData?.data.task_deleted_at && !isZeroEpoch(taskInfo.taskData?.data.task_deleted_at) &&
              <div className='w-full bg-red-700 mb-2 pl-4 pr-4 rounded-sm h-16 text-red-200 flex justify-between items-center'>
                <div className= 'flex gap-x-2'>
                  <Trash2 className='h-5 w-5'/>
                  {t('thisTaskIsDeleted')}
                </div>
                <Button variant='destructive' onClick={handleUndeleteTask}>
                  {t('undelete')}
                </Button>
              </div>
            }
            {taskInfo.taskData?.data.task_parent_task &&
                <div className="ml-4 pr-4 mb-3 text-lg">{`Parent: `}<a  className="hover:underline hover:cursor-pointer" onClick={()=>{dispatch(openSideBarTaskInfo({taskId: taskInfo.taskData?.data.task_parent_task.task_uuid ||''}))}}>{taskInfo.taskData?.data.task_parent_task.task_name}</a></div>

            }
            <div className="pl-4 pr-4 pb-4 ">

              <Badge variant="default" className='text-sm w-fit' style={{width: `${taskLabelWidth + 1}px`}}
              >
                    <span
                        ref={badgeSpanRef}
                        className="invisible absolute whitespace-pre px-3 py-2"
                        style={{
                          fontFamily: 'inherit',
                          fontSize: 'inherit',
                          fontWeight: 'inherit',
                        }}
                    >
                    {taskLabel || t('addLabel')}
                  </span>
                <Input
                    type={'text'}
                    value={taskLabel}
                    placeholder= {t('addLabel')}
                    readOnly={!isAdmin}
                    className="m-0 !h-fit !w-fit border-0 p-0 shadow-none !ring-0 focus:border-0 focus:outline-none focus-visible:ring-0"
                    onChange={handleChangeTaskLabel}
                />

              </Badge>
              <div className=" mt-4 mb-4">
                <ResizeableTextInput
                    delay={3000}
                    content={taskInfo.taskData?.data.task_name || ''}
                    textUpdate={(s: string) => {
                      updateTaskName(s, taskUUID)
                    }}
                    className='text-3xl -ml-2'
                />
              </div>
              <div className='-ml-2 flex space-x-3 mb-6'>
                <Popover open={openTaskStatus} onOpenChange={setOpenTaskStatus}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className=" justify-start"
                            disabled={!isAdmin}
                        >
                          {selectedStatus ? (
                              <>
                                <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0"/>
                                {selectedStatus.label}
                              </>
                          ) : (
                              <>+ {t('setStatus')}</>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('taskStatus')}</p>
                    </TooltipContent>
                  </Tooltip>

                  <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                      <CommandInput placeholder={t('changeStatusPlaceHolder')}/>
                      <CommandList>
                        <CommandEmpty>{t('noResultFound')}</CommandEmpty>
                        <CommandGroup>
                          {statuses.map((status) => (
                              <CommandItem
                                  key={status.value}
                                  value={status.value}
                                  onSelect={(value) => {
                                    setSelectedStatus(
                                        statuses.find((priority) => priority.value === value) || undefined
                                    )
                                    setOpenTaskStatus(false)
                                    updateTaskStatus(value, taskUUID)
                                  }}
                              >
                                <status.icon
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        status.value === selectedStatus?.value
                                            ? "opacity-100"
                                            : "opacity-40"
                                    )}
                                />
                                <span>{status.label}</span>
                              </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Popover open={openTaskPriority} onOpenChange={setOpenTaskPriority}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className=" justify-start"
                            disabled={!isAdmin}
                        >
                          {selectedPriority ? (
                              <>
                                <selectedPriority.icon className="mr-2 h-4 w-4 shrink-0"/>
                                {selectedPriority.label}
                              </>
                          ) : (
                              <>+ {t('setPriority')}</>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('taskPriority')}</p>
                    </TooltipContent>
                  </Tooltip>

                  <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                      <CommandInput placeholder={t('changePriority')}/>
                      <CommandList>
                        <CommandEmpty>{t('noResultFound')}</CommandEmpty>
                        <CommandGroup>
                          {priorities.map((status) => (
                              <CommandItem
                                  key={status.value}
                                  value={status.value}
                                  onSelect={(value) => {
                                    setSelectedPriority(
                                        priorities.find((priority) => priority.value === value) || undefined
                                    )
                                    setOpenTaskPriority(false)
                                    updateTaskPriority(value)
                                  }}
                              >
                                <status.icon
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        status.value === selectedStatus?.value
                                            ? "opacity-100"
                                            : "opacity-40"
                                    )}
                                />
                                <span>{t(status.label)}</span>
                              </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

              </div>
              <div className="grid grid-cols-4 mb-6">
                <div className="col-span-1">
                  <Label>{t('assignee')}</Label>
                </div>
                <div className="col-span-3 -ml-4">

                  <Popover open={assigneePopoverOpen} onOpenChange={setAssigneePopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={assigneePopoverOpen}
                          className="w-[200px] justify-between"
                          disabled={!isAdmin}
                      >
                        {taskAssignee
                            ? taskAssignee.user_name
                            : t('selectAssignee')}
                        <ChevronsUpDown className="opacity-50"/>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent ref={userListDivRef} className="w-[200px] p-0 user-list-popover">
                      <Command>
                        <CommandInput placeholder="Search member..."/>
                        <CommandList>
                          <CommandEmpty>No member found.</CommandEmpty>
                          <CommandGroup>
                            {taskInfo.taskData?.data.task_project.project_members.map((member) => (
                                <CommandItem
                                    key={member.user_uuid}
                                    value={member.user_uuid}
                                    onSelect={(currentValue) => {
                                      const userInfo = taskInfo.taskData?.data.task_project.project_members.find((member) => member.user_uuid === currentValue)
                                      const selectedTaskAssignee = currentValue === taskAssignee?.user_uuid ? undefined : userInfo
                                      setTaskAssignee(selectedTaskAssignee)
                                      updateTaskAssignee(selectedTaskAssignee ? currentValue: undefined, taskUUID)
                                      setAssigneePopoverOpen(false)


                                    }}
                                >
                                  <span className='user-list-popover'>{member.user_name}</span>
                                  <Check
                                      className={cn(
                                          "ml-auto",
                                          taskAssignee?.user_uuid === member.user_uuid ? "opacity-100" : "opacity-0"
                                      )}
                                  />
                                </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 mb-6">
                <div className="col-span-1 text-m">
                  <Label>{t('startDate')}</Label>
                </div>
                <div className="col-span-3">
                  <div className='relative w-fit'>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "-ml-4 text-left font-normal",
                                !startDate && "text-muted-foreground"
                            )}
                            disabled={!isAdmin}
                        >
                          {startDate ? (
                              format(startDate, "dd MMM")
                          ) : (
                              <span>{t('startDate')}</span>
                          )}
                          <CalenderIcon className="ml-2 h-4 w-4"/>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(d: Date | undefined) => {
                              updateTaskStartDate(d, taskUUID)
                            }}
                            initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {startDate && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -right-4 -top-4 transform rounded-full decoration-0 p-0 hover:bg-transparent"
                            onClick={() => {
                              setStartDate(undefined)
                              updateTaskStartDate(undefined, taskUUID)
                            }}
                            disabled={!isAdmin}
                        >
                          <X className="h-1 w-1"/>
                        </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 mb-6">
                <div className="col-span-1 text-m">
                  <Label>{t('dueDate')}</Label>
                </div>
                <div className="col-span-3">
                  <div className='relative w-fit'>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                " -ml-4 text-left font-normal",
                                !dueDate && "text-muted-foreground"
                            )}
                            disabled={!isAdmin}
                        >
                          {dueDate ? format(dueDate, "dd MMM") : <span>{t('dueDate')}</span>}
                          <CalenderIcon className="ml-2 h-4 w-4"/>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={dueDate}
                            onSelect={(d: Date | undefined) => {
                              updateTaskDueDate(d, taskUUID)
                            }}
                            initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {dueDate && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -right-4 -top-4 transform rounded-full decoration-0 p-0 hover:bg-transparent"
                            onClick={() => {
                              setDueDate(undefined)
                              updateTaskDueDate(undefined, taskUUID)
                            }}
                            disabled={!isAdmin}
                        >
                          <X className="h-1 w-1"/>
                        </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 mb-6">
                <div className="col-span-1 text-m">
                  <Label>{t('project')}</Label>
                </div>
                <div className="col-span-3">{taskInfo.taskData?.data.task_project.project_name}</div>
              </div>
              <div className="grid grid-cols-4 mb-6">
                <div className="col-span-1 text-m">
                  <Label>{t('team')}</Label>
                </div>
                <div className="col-span-3">{taskInfo.taskData?.data.task_team.team_name}</div>
              </div>
              <div className="grid gap-2 mb-4">
                <Label>{t('description')}</Label>
                <MinimalTiptapTask
                    throttleDelay={3000}
                    className={cn("h-full rounded-xl min-h-48")}
                    editorContentClassName="overflow-auto h-full"
                    output="html"
                    content={taskInfo.taskData?.data.task_description}
                    placeholder={t('descriptionPlaceholder')}
                    editable={isAdmin}
                    editorClassName="focus:outline-none px-5 py-4 h-full"
                    onChange={(content: Content) => {
                      updateTaskDesc(content?.toString() || '')

                    }}
                />
              </div>
              <div className='mb-2'>
                <Label className='inline'>{t('attachments')}</Label>
              </div>
              <Label htmlFor="file-upload-task" className="cursor-pointer text-sm  text-muted-foreground hover:underline">
                {t('attachFiles')}
              </Label>

              <Input
                  type="file"
                  id="file-upload-task"
                  multiple
                  onChange={handleTaskFileUpload}
                  style={{display: "none"}}
                  key={
                      (taskState[taskUUID]?.filesPreview &&
                          taskState[taskUUID]?.filesPreview
                              .length)||
                      0
                  }
              />

              <div className="flex flex-wrap mb-4">
                {taskInfo.taskData?.data.task_attachments &&
                    taskInfo.taskData?.data.task_attachments.map(
                        (file) => {
                          return (
                              <div key={file.attachment_uuid}>

                              <TaskAttachment attachmentInfo={file} taskUUID={taskUUID} isAdmin={isAdmin}/>
                              </div>
                          );
                        }
                    )}
                {taskState[taskUUID]?.filesPreview &&
                    taskState[taskUUID].filesPreview.map(
                        (file) => {
                          return (
                              <div
                                  key={file.key}
                                  className="flex relative justify-center items-center m-1 mt-2 p-1 border rounded-xl border-gray-700"
                              >
                                <button
                                    className="absolute top-0 right-0 p-1 -mt-2 -mr-2 bg-background rounded-full border-gray-700 border"
                                    onClick={() => removeTaskPreviewFile(file.key)}
                                >
                                  <X height="1rem" width="1rem"/>
                                </button>
                                <div>
                                  <AttachmentIcon fileName={file.fileName}/>
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

              <div className='mb-4'>
                <Label>{t('subTasks')}</Label>
              </div>
              {/* Subtask items */}
              {taskInfo.taskData?.data.task_sub_tasks && taskInfo.taskData?.data.task_sub_tasks
                  .map((subTask) => {

                        let startDate: undefined | Date = undefined
                        let dueDate: undefined | Date = undefined

                        if (subTask.task_start_date && !isZeroEpoch(subTask.task_start_date)) {
                          startDate = new Date(subTask.task_start_date);
                        }
                        if (subTask.task_due_date && !isZeroEpoch(subTask.task_due_date)) {
                          dueDate = new Date(subTask.task_due_date);
                        }

                        return (
                            <div
                                key={subTask.task_uuid}
                                className="flex items-center justify-between px-4 py-2"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <CircleCheck className={'w-5 h-5 hover:cursor-pointer '+ (subTask.task_status == 'done'?'text-green-500':'')} onClick={()=>{updateTaskStatus((subTask.task_status == 'done'?'todo':'done'), subTask.task_uuid)}}/>
                                <ResizeableTextInput
                                    delay={3000}
                                    content={subTask.task_name}
                                    textUpdate={(s: string) => {
                                      updateTaskName(s, subTask.task_uuid)
                                    }}
                                    placeholder="Enter sub task name..."
                                    textUpdateOnEnter={(s: string) => {
                                      updateTaskName(s, subTask.task_uuid)
                                    }}
                                />
                              </div>
                              <div className="flex items-center gap-4">
                                <div className='relative w-fit'>
                                  <Popover>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <PopoverTrigger asChild>
                                          <Button
                                              variant="outline"
                                              className={cn(
                                                  "ml-2 text-left font-normal",
                                                  !startDate && "text-muted-foreground"
                                              )}
                                              disabled={!isAdmin}
                                          >
                                            {startDate &&
                                                format(startDate, "dd MMM")
                                            }
                                            <CalenderIcon className=" h-4 w-4"/>
                                          </Button>
                                        </PopoverTrigger>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{t('startDate')}</p>
                                      </TooltipContent>
                                    </Tooltip>

                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                          mode="single"
                                          selected={startDate}
                                          onSelect={(d: Date | undefined) => {
                                            updateTaskStartDate(d, subTask.task_uuid)
                                          }}
                                          initialFocus
                                          disabled={!isAdmin}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  {startDate && (
                                      <Button
                                          variant="ghost"
                                          size="icon"
                                          className="absolute -right-4 -top-4 transform rounded-full decoration-0 p-0 hover:bg-transparent"
                                          onClick={() => {
                                            updateTaskStartDate(undefined, subTask.task_uuid)
                                          }}
                                          disabled={!isAdmin}
                                      >
                                        <X className="h-1 w-1"/>
                                      </Button>
                                  )}
                                </div>
                                <div className='relative w-fit'>
                                  <Popover>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <PopoverTrigger asChild>
                                          <Button
                                              variant="outline"
                                              className={cn(
                                                  "text-left font-normal",
                                                  !dueDate && "text-muted-foreground"
                                              )}
                                              disabled={!isAdmin}
                                          >
                                            {dueDate &&
                                                format(dueDate, "dd MMM")
                                            }
                                            <CalenderIcon className="h-4 w-4"/>
                                          </Button>
                                        </PopoverTrigger>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{t('dueDate')}</p>
                                      </TooltipContent>
                                    </Tooltip>

                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                          mode="single"
                                          selected={dueDate}
                                          onSelect={(d: Date | undefined) => {
                                            updateTaskDueDate(d, subTask.task_uuid)
                                          }}
                                          initialFocus
                                          disabled={!isAdmin}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  {dueDate && (
                                      <Button
                                          variant="ghost"
                                          size="icon"
                                          className="absolute -right-4 -top-4 transform rounded-full decoration-0 p-0 hover:bg-transparent"
                                          onClick={() => {
                                            updateTaskDueDate(undefined, subTask.task_uuid)
                                          }}
                                          disabled={!isAdmin}
                                      >
                                        <X className="h-1 w-1"/>
                                      </Button>
                                  )}
                                </div>
                                <SubTaskAssignee
                                    taskUUID={subTask.task_uuid}
                                    assigneeUpdate={(uid: string | undefined) => {
                                      updateTaskAssignee(uid, subTask.task_uuid)
                                    }}
                                    userUUID={subTask.task_assignee?.user_uuid}
                                />
                                <Button variant="ghost" size="icon"
                                        onClick={() => {
                                          dispatch(openSideBarTaskInfo({taskId: subTask.task_uuid}))
                                        }}
                                >
                                  <ChevronRight className="w-5 h-5"/>
                                </Button>
                              </div>
                            </div>
                        )
                      }
                  )
              }
              {
                  subTaskInfo &&
                  <div
                      ref={newSubTaskDivRef}
                      className="flex items-center justify-between px-4 mb-4"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <ResizeableTextInput
                          delay={0}
                          content={subTaskInfo.task_name}
                          textUpdate={(e) => {
                            setSubTaskInfo(prev => ({
                              ...prev!,
                              task_name: e,
                            }))
                          }}
                          placeholder="Enter sub task name..."
                          textUpdateOnEnter={(e) => {
                            setSubTaskInfo(prev => ({
                              ...prev!,
                              task_name: e,
                            }))
                            createSubTask()
                          }}
                      />
                    </div>
                    {subTaskInfo.task_name && <div className="flex items-center gap-4">
                      <div className='relative w-fit'>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "ml-2 text-left font-normal",
                                    !startDate && "text-muted-foreground"
                                )}
                                disabled={!isAdmin}
                            >
                              {subTaskInfo.task_start_date ? (
                                  format(subTaskInfo.task_start_date, "dd MMM")
                              ) : (
                                  <span>{t('startDate')}</span>
                              )}
                              <CalenderIcon className="ml-2 h-4 w-4"/>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={subTaskInfo.task_start_date}
                                onSelect={(d: Date | undefined) => {
                                  setSubTaskInfo(prev => ({
                                    ...prev!,
                                    task_start_date: d
                                  }))
                                }}
                                disabled={!isAdmin}
                                initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {subTaskInfo.task_start_date && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute -right-4 -top-4 transform rounded-full decoration-0 p-0 hover:bg-transparent"
                                onClick={() => {
                                  setSubTaskInfo(prev => ({
                                    ...prev!,
                                    task_start_date: undefined
                                  }))
                                }}
                                disabled={!isAdmin}
                            >
                              <X className="h-1 w-1"/>
                            </Button>
                        )}
                      </div>
                      <div className='relative w-fit'>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    " text-left font-normal",
                                    !subTaskInfo.task_due_date && "text-muted-foreground"
                                )}
                                disabled={!isAdmin}
                            >
                              {subTaskInfo.task_due_date ? (
                                  format(subTaskInfo.task_due_date, "dd MMM")
                              ) : (
                                  <span>{t('dueDate')}</span>
                              )}
                              <CalenderIcon className="ml-2 h-4 w-4"/>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={subTaskInfo.task_due_date}
                                onSelect={(d: Date | undefined) => {
                                  setSubTaskInfo(prev => ({
                                    ...prev!,
                                    task_due_date: d
                                  }))
                                }}
                                disabled={!isAdmin}
                                initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {subTaskInfo.task_due_date && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute -right-4 -top-4 transform rounded-full decoration-0 p-0 hover:bg-transparent"
                                onClick={() => {
                                  setSubTaskInfo(prev => ({
                                    ...prev!,
                                    task_due_date: undefined
                                  }))
                                }}
                                disabled={!isAdmin}
                            >
                              <X className="h-1 w-1"/>
                            </Button>
                        )}
                      </div>
                      <SubTaskAssignee taskUUID={taskUUID} assigneeUpdate={(uid: string | undefined) => {
                        setSubTaskInfo(prev => ({
                          ...prev!,
                          task_assignee_uuid: uid
                        }))
                      }}
                                       userUUID={subTaskInfo.task_assignee_uuid}
                      />

                    </div>}
                  </div>

              }

              <Button variant="outline" className='-ml-2 mt-2 mb-4' disabled={!isAdmin} onClick={() => {
                setSubTaskInfo({
                  task_name: '',
                  task_assignee_uuid: '',
                  task_due_date: undefined,
                  task_start_date: undefined,
                })

              }}>
                <CirclePlus className="mr-2 h-4 w-4"/> {t('addSubTask')}
              </Button>

              <Separator orientation='horizontal'/>
              <div className='mt-4'>
                <div className='mb-4'>
                  <Label>{t('comments')}
                    (<span>{taskInfo.taskData?.data?.task_comments ? taskInfo.taskData?.data.task_comments.length : '0'}</span>)</Label>
                </div>

                <div>
                  {taskInfo.taskData?.data.task_comments && taskInfo.taskData?.data.task_comments
                      .map((commentsInfo) => {
                        return (<div className='pl-4 pr-4' key={commentsInfo.comment_uuid}>
                          <Separator orientation='horizontal'/>
                          <TaskComment
                              commentInfo={commentsInfo} taskUUID={taskUUID}
                              isOwner={userInfo.userData?.data.user_uuid == commentsInfo.comment_created_by.user_uuid}
                              isAdmin={taskInfo.taskData?.data.task_project.project_is_admin || false}
                          />
                        </div>)
                      })}
                </div>
              </div>
            </div>
          </div>

          {/* Comments section - fixed at bottom */}
          <div className="flex-shrink-0 border-t p-4">
            <div className="">
              <MinimalTiptapTask
                  throttleDelay={300}
                  className={cn("w-full rounded-xl min-h-24")}
                  editorContentClassName="overflow-auto"
                  output="html"
                  content={commentState[taskUUID]?.commentBody}
                  placeholder={t('addCommentPlaceholder')}
                  editable={true}
                  buttonLabel={t('comment')}
                  buttonOnclick={createComment}
                  editorClassName="focus:outline-none px-5 py-4"
                  onChange={(content: Content) => {
                    dispatch(createOrUpdateTaskCommentBody({body: (content?.toString() || ''), taskUUID:taskUUID}))
                  }}
              />
            </div>
            <Label htmlFor="file-upload-task-comment" className="cursor-pointer ml-2 pt-2 text-muted-foreground hover:underline">
              {t('attachFiles')}
            </Label>

            <Input
                type="file"
                id="file-upload-task-comment"
                multiple
                onChange={handleCommentFileUpload}
                style={{display: "none"}}
                key={
                    (commentState[taskUUID]?.filesPreview &&
                        commentState[taskUUID]?.filesPreview
                            .length)||
                    0
                }
            />

            <div className="flex flex-wrap">
              {commentState[taskUUID]?.filesPreview &&
                  commentState[taskUUID].filesPreview.map(
                      (file, index) => {
                        return (
                            <div
                                key={index}
                                className="flex relative justify-center items-center m-1 mt-2 p-1 border rounded-xl border-gray-700"
                            >
                              <button
                                  className="absolute top-0 right-0 p-1 -mt-2 -mr-2 bg-background rounded-full border-gray-700 border"
                                  onClick={() => removeCommentPreviewFile(file.key)}
                              >
                                <X height="1rem" width="1rem"/>
                              </button>
                              <div>
                                <AttachmentIcon fileName={file.fileName}/>
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

          </div>
        </div>
      </div>
          </Transition>


  );
};

export default RightResizableSidebar;