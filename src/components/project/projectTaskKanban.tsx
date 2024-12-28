import {useCallback, useEffect, useRef, useState} from 'react';
import { statuses } from '@/components/task/data';
import {
    closestCenter,
    CollisionDetection,
    DndContext,
     DragOverlay,  getFirstCollision, KeyboardSensor, MeasuringStrategy, MouseSensor,
    pointerWithin, rectIntersection, TouchSensor,
    UniqueIdentifier, useSensor, useSensors
} from '@dnd-kit/core';
import {
    MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import taskService, {TaskInfoInterface} from "@/services/TaskService.ts";
import {TOAST_UNKNOWN_ERROR} from "@/constants/dailog/const.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {mutate} from "swr";
import {openCreateTaskPopup} from "@/store/slice/popupSlice.ts";
import {CirclePlus} from "lucide-react";
import {useDispatch} from "react-redux";
import {prioritiesInterface} from "@/components/task/data.tsx";
import projectService from "@/services/ProjectService.ts";
import {KanbanAssigneeFilter} from "@/components/project/KanbanAssigneeFilter.tsx";
import {useTranslation} from "react-i18next";
import {GetTaskStatusQueryParamByStatus} from "@/utils/Helper.ts";
import {
    dropAnimation, DroppableContainer,
    Items,
    KanbanProps, PLACEHOLDER_ID, SortableItem,
    TRASH_ID
} from "@/components/task/myTaskKanban.tsx";
import {Container, Item} from "@/components/kanbanComponents";
import {
    coordinateGetter as multipleContainersCoordinateGetter
} from "@/components/task/multipleContainersKeyboardCoordinates.ts";
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {createPortal, unstable_batchedUpdates} from "react-dom";
import {TaskKanbanColumnPriorityFilter} from "@/components/task/taskKanbanColumnPriorityFilter.tsx";



export const ProjectTaskKanban = ({
                                      adjustScale = false,
                                      cancelDrop,
                                      columns,
                                      handle = false,
                                      containerStyle,
                                      coordinateGetter = multipleContainersCoordinateGetter,
                                      getItemStyles = () => ({}),
                                      wrapperStyle = () => ({}),
                                      minimal = false,
                                      modifiers,
                                      strategy = verticalListSortingStrategy,
                                      trashable = false,
                                      vertical = false,
                                      scrollable,
                                        projectId=''
                                  }: KanbanProps) => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const {t} = useTranslation()
    const [assigneeFilter, setAssigneeFilter] = useState<string[]>([])
    const [viewableStatus, setViewableStatus] = useState<Record<string, boolean>>({
        todo: true,
        inProgress: true,
        done: true
    });
    const projectInfo = projectService.getProjectInfo(projectId);
    const isAdmin = projectInfo.projectData?.data.project_is_admin || false;



    const [containers, setContainers] = useState([] as UniqueIdentifier[]);

    useEffect(() => {
        setContainers(Object.keys(viewableStatus).filter(key => viewableStatus[key]) as UniqueIdentifier[]);
    }, [viewableStatus]);


    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);

    // backlogTask
    const queryStringBacklog = GetTaskStatusQueryParamByStatus({getAll:true, status:'backlog', priorityFilter, assigneeFilter:assigneeFilter});
    const taskBacklogInfo = taskService.getProjectTaskList(projectId, queryStringBacklog);

    // todoTask
    const queryStringTodo = GetTaskStatusQueryParamByStatus({getAll:true, status:'todo', priorityFilter, assigneeFilter:assigneeFilter});
    const taskTodoInfo = taskService.getProjectTaskList(projectId, queryStringTodo);

    // inProgressTask
    const queryStringInProgress = GetTaskStatusQueryParamByStatus({getAll:true, status:'inProgress', priorityFilter, assigneeFilter:assigneeFilter});
    const taskInProgressInfo = taskService.getProjectTaskList(projectId, queryStringInProgress);

    // done
    const queryStringDone = GetTaskStatusQueryParamByStatus({getAll:true, status:'done', priorityFilter, assigneeFilter:assigneeFilter});
    const taskDoneInfo = taskService.getProjectTaskList(projectId, queryStringDone);

    // canceled
    const queryStringCanceled = GetTaskStatusQueryParamByStatus({getAll:true, status:'canceled', priorityFilter, assigneeFilter:assigneeFilter});
    const taskCanceledInfo = taskService.getProjectTaskList(projectId, queryStringCanceled);

    const [items, setItems] = useState<Items>(
        () =>
            ({
                backlog: [] as TaskInfoInterface[],
                todo:  [] as TaskInfoInterface[],
                inProgress:  [] as TaskInfoInterface[],
                done: [] as TaskInfoInterface[],
                canceled: [] as TaskInfoInterface[],
            })
    );

    const [activeId, setActiveId] = useState<UniqueIdentifier |  null>(null);
    const [activeTask, setActiveTask] = useState<TaskInfoInterface |  null>(null);

    const lastOverId = useRef<UniqueIdentifier| null>(null);
    const recentlyMovedToNewContainer = useRef(false);
    const isSortingContainer =
        activeId != null ? viewableStatus[activeId] : false;


    const collisionDetectionStrategy: CollisionDetection = useCallback(
        (args) => {
            if (activeId && viewableStatus[activeId]) {
                return closestCenter({
                    ...args,
                    droppableContainers: args.droppableContainers.filter(
                        (container) => viewableStatus[container.id]
                    ),
                });
            }

            // Start by finding any intersecting droppable
            const pointerIntersections = pointerWithin(args);
            const intersections =
                pointerIntersections.length > 0
                    ? // If there are droppables intersecting with the pointer, return those
                    pointerIntersections
                    : rectIntersection(args);
            let overId = getFirstCollision(intersections, 'id');

            if (overId != null) {
                if (overId === TRASH_ID) {
                    // If the intersecting droppable is the trash, return early
                    // Remove this if you're not using trashable functionality in your app
                    return intersections;
                }

                if (viewableStatus[overId]) {
                    const containerItems = items[overId];

                    // If a container is matched and it contains items (columns 'A', 'B', 'C')
                    if (containerItems.length > 0) {
                        // Return the closest droppable within that container
                        overId = closestCenter({
                            ...args,
                            droppableContainers: args.droppableContainers.filter(
                                (container) =>
                                    container.id !== overId &&
                                    containerItems.find((t) => t.task_uuid === container.id)
                            ),
                        })[0]?.id;
                    }
                }

                lastOverId.current = overId;

                return [{id: overId}];
            }

            // When a draggable item moves to a new container, the layout may shift
            // and the `overId` may become `null`. We manually set the cached `lastOverId`
            // to the id of the draggable item that was moved to the new container, otherwise
            // the previous `overId` will be returned which can cause items to incorrectly shift positions
            if (recentlyMovedToNewContainer.current) {
                lastOverId.current = activeId;
            }

            // If no droppable is matched, return the last match
            return lastOverId.current ? [{id: lastOverId.current}] : [];
        },
        [activeId, items]
    );

    const [clonedItems, setClonedItems] = useState<Items | null>(null);
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter,
        })
    );
    const findContainer = (id: UniqueIdentifier) => {
        if (id in items) {
            return id;
        }

        return Object.keys(items).find((key) => items[key].find((t)=>t.task_uuid === id));
    };


    const getIndex = (id: UniqueIdentifier) => {
        const container = findContainer(id);

        if (!container) {
            return -1;
        }

        const index = items[container].findIndex(t => t.task_uuid == id);

        return index;
    };

    const onDragCancel = () => {

        if (clonedItems) {
            // Reset items to their original state in case items have been
            // Dragged across containers
            setItems(clonedItems);
        }

        setActiveId(null);
        setClonedItems(null);
    };

    useEffect(() => {
        requestAnimationFrame(() => {
            recentlyMovedToNewContainer.current = false;
        });
    }, [items]);



    useEffect(() => {

            setItems( () =>
                ({
                    backlog: taskBacklogInfo.projectData?.data.project_tasks || [] as TaskInfoInterface[],
                    todo: taskTodoInfo.projectData?.data.project_tasks || [] as TaskInfoInterface[],
                    inProgress: taskInProgressInfo.projectData?.data.project_tasks || [] as TaskInfoInterface[],
                    done: taskDoneInfo.projectData?.data.project_tasks || [] as TaskInfoInterface[],
                    canceled: taskCanceledInfo.projectData?.data.project_tasks || [] as TaskInfoInterface[],
                }))


    }, [taskBacklogInfo.projectData?.data.project_tasks, taskTodoInfo.projectData?.data.project_tasks, taskInProgressInfo.projectData?.data.project_tasks, taskDoneInfo.projectData?.data.project_tasks, taskCanceledInfo.projectData?.data.project_tasks]);



    function renderSortableItemDragOverlay(id: UniqueIdentifier) {

        return (
            <Item
                task={activeTask||{} as TaskInfoInterface}
                value={id}
                handle={handle}
                style={getItemStyles({
                    containerId: findContainer(id) as UniqueIdentifier,
                    overIndex: -1,
                    index: getIndex(id),
                    value: id,
                    isSorting: true,
                    isDragging: true,
                    isDragOverlay: true,
                })}

                wrapperStyle={wrapperStyle({index: 0})}
                dragOverlay
            />
        );
    }

    function renderContainerDragOverlay(containerId: UniqueIdentifier) {
        return (
            <Container
                label={containerId as string}
                columns={columns}
                style={{
                    height: '100%',
                }}
                shadow
                unstyled={false}
            >
                {items[containerId].map((item, index) => (
                    <Item
                        key={item.task_uuid}
                        value={item.task_uuid}
                        handle={handle}
                        style={getItemStyles({
                            containerId,
                            overIndex: -1,
                            index: getIndex(item.task_uuid),
                            value: item.task_uuid,
                            isDragging: false,
                            isSorting: false,
                            isDragOverlay: false,
                        })}

                        wrapperStyle={wrapperStyle({index})}
                        task={item}
                    />
                ))}
            </Container>
        );
    }

    // function handleRemove(containerID: UniqueIdentifier) {
    //     setContainers((containers) =>
    //         containers.filter((id) => id !== containerID)
    //     );
    // }
    //
    // function handleAddColumn() {
    //     const newContainerId = getNextContainerId();
    //
    //     unstable_batchedUpdates(() => {
    //         setContainers((containers) => [...containers, newContainerId]);
    //         setItems((items) => ({
    //             ...items,
    //             [newContainerId]: [],
    //         }));
    //     });
    // }

    function getNextContainerId() {
        const containerIds = Object.keys(items);
        const lastContainerId = containerIds[containerIds.length - 1];

        return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
    }


    const updateTaskStatus = async (taskStatus: string, taskId: string) => {

        try {
            await taskService.updateTaskStatus({task_status: taskStatus, task_uuid: taskId, task_project_uuid: projectId})
            toast({
                title: t('success'),
                description: t('updatedTaskStatus'),
            });

            mutate(
                key => typeof key === 'string' && key.startsWith(`/api/project/taskList/${projectId}?filters=`)
            )
        } catch (e) {

            const errorMessage = e instanceof Error
                ? e.message
                : TOAST_UNKNOWN_ERROR;

            toast({
                title:  t('failure'),
                description: `${t('failedToUpdateTaskStatus')}: ${errorMessage}`,
                variant: "destructive",
            })

            return

        }


    }

    async function handleDragEnd(taskInfo: TaskInfoInterface, newStatus: string) {


        if(!projectInfo.projectData?.data.project_is_admin || newStatus === taskInfo.task_status) return


        await updateTaskStatus(newStatus, taskInfo.task_uuid)
    }

    return (
        <div className="p-4">
            <div className='flex  mb-4 justify-between'>
                <div className='flex space-x-2'>
                    <KanbanAssigneeFilter activeList={assigneeFilter} updateList={setAssigneeFilter} projectId={projectId}/>
                    <TaskKanbanColumnPriorityFilter activeList={priorityFilter} updateList={setPriorityFilter}/>

                </div>


                <div className='flex space-x-2'>
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto hidden h-8 lg:flex"
                        onClick={()=>{dispatch(openCreateTaskPopup())}}
                    >
                        <CirclePlus className='h-4 w-4'/>{" "}{t('createTask')}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto hidden h-8 lg:flex"
                            >
                                <MixerHorizontalIcon className="mr-2 h-4 w-4" />
                                {t('view')}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[150px]">
                            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {statuses.map((column:prioritiesInterface) => (
                                <DropdownMenuCheckboxItem
                                    key={column.value}
                                    className="capitalize"
                                    checked={viewableStatus[column.value as keyof typeof viewableStatus]}
                                    onCheckedChange={(value) =>
                                        setViewableStatus((prev) => ({
                                            ...prev,
                                            [column.value]: value
                                        }))
                                    }
                                >
                                    {column.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>


            <div className="mt-2">
                <div className="flex h-full gap-4 pb-4">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={collisionDetectionStrategy}
                        measuring={{
                            droppable: {
                                strategy: MeasuringStrategy.Always,
                            },
                        }}
                        onDragStart={({active}) => {
                            if(active.data.current?.task && !isAdmin) return
                            setActiveTask(active.data.current?.task as TaskInfoInterface);

                            setActiveId(active.id);
                            setClonedItems(items);
                        }}
                        onDragOver={({active, over}) => {
                            const overId = over?.id;

                            if(active.data.current?.task && !isAdmin) return

                            if (overId == null || overId === TRASH_ID || active.id in items) {
                                return;
                            }

                            const overContainer = findContainer(overId);
                            const activeContainer = findContainer(active.id);

                            if (!overContainer || !activeContainer) {
                                return;
                            }

                            if (activeContainer !== overContainer) {

                                setItems((items) => {
                                    const activeItems = items[activeContainer];
                                    const overItems = items[overContainer];
                                    const overIndex = overItems.findIndex(t => t.task_uuid === overId);
                                    const activeIndex = activeItems.findIndex(t=>t.task_uuid === active.id);

                                    let newIndex: number;

                                    if (overId in items) {
                                        newIndex = overItems.length + 1;
                                    } else {
                                        const isBelowOverItem =
                                            over &&
                                            active.rect.current.translated &&
                                            active.rect.current.translated.top >
                                            over.rect.top + over.rect.height;

                                        const modifier = isBelowOverItem ? 1 : 0;

                                        newIndex =
                                            overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
                                    }

                                    recentlyMovedToNewContainer.current = true;

                                    return {
                                        ...items,
                                        [activeContainer]: items[activeContainer].filter(
                                            (item) => item.task_uuid !== active.id
                                        ),
                                        [overContainer]: [
                                            ...items[overContainer].slice(0, newIndex),
                                            items[activeContainer][activeIndex],
                                            ...items[overContainer].slice(
                                                newIndex,
                                                items[overContainer].length
                                            ),
                                        ],
                                    };
                                });
                            }
                        }}
                        onDragEnd={({active, over}) => {
                            if (active.id in items && over?.id) {
                                setContainers((containers) => {
                                    const activeIndex = containers.indexOf(active.id);
                                    const overIndex = containers.indexOf(over.id);

                                    return arrayMove(containers, activeIndex, overIndex);
                                });
                            }

                            const activeContainer = findContainer(active.id);

                            if (!activeContainer) {
                                setActiveId(null);
                                return;
                            }

                            const overId = over?.id;

                            if (overId == null) {
                                setActiveId(null);
                                setActiveTask(null);
                                return;
                            }

                            if (overId === TRASH_ID) {
                                setItems((items) => ({
                                    ...items,
                                    [activeContainer]: items[activeContainer].filter(
                                        (id) => id.task_status !== activeId
                                    ),
                                }));
                                setActiveId(null);
                                return;
                            }

                            if (overId === PLACEHOLDER_ID) {
                                const newContainerId = getNextContainerId();

                                unstable_batchedUpdates(() => {
                                    setContainers((containers) => [...containers, newContainerId]);
                                    setItems((items) => ({
                                        ...items,
                                        [activeContainer]: items[activeContainer].filter(
                                            (id) => id.task_uuid !== activeId
                                        ),
                                        [newContainerId]: items[newContainerId].filter(
                                            (id) => id.task_uuid !== active.id
                                        ),
                                    }));
                                    setActiveId(null);
                                    setActiveTask(null);
                                });
                                return;
                            }

                            const overContainer = findContainer(overId);

                            if (overContainer) {
                                const activeIndex = items[activeContainer].findIndex(t=>t.task_uuid === active.id);
                                const overIndex = items[overContainer].findIndex(t=>t.task_uuid === overId);

                                if (activeIndex !== overIndex) {
                                    setItems((items) => ({
                                        ...items,
                                        [overContainer]: arrayMove(
                                            items[overContainer],
                                            activeIndex,
                                            overIndex
                                        ),
                                    }));
                                }


                            }
                            if(active.data.current?.task) {

                                handleDragEnd(active.data.current?.task, over?.data.current?.containerId);
                            }

                            setActiveId(null);
                        }}
                        cancelDrop={cancelDrop}
                        onDragCancel={onDragCancel}
                        modifiers={modifiers}
                    >
                        <div
                            className="inline-grid box-border [grid-auto-flow:column]"

                        >
                            <SortableContext
                                items={[...containers, PLACEHOLDER_ID]}
                                strategy={
                                    vertical
                                        ? verticalListSortingStrategy
                                        : horizontalListSortingStrategy
                                }
                            >
                                {containers.map((containerId) => (
                                    <DroppableContainer
                                        key={containerId}
                                        id={containerId}
                                        label={containerId as string}
                                        columns={columns}
                                        items={items[containerId]}
                                        scrollable={scrollable}
                                        style={containerStyle}
                                        unstyled={minimal}
                                        // onRemove={() => handleRemove(containerId)}
                                    >
                                        <SortableContext items={items[containerId]} strategy={strategy}>
                                            {items[containerId].map((value, index) => {
                                                return (
                                                    <SortableItem
                                                        disabled={isSortingContainer}
                                                        key={value.task_uuid}
                                                        id={value.task_uuid}
                                                        index={index}
                                                        handle={handle}
                                                        style={getItemStyles}
                                                        wrapperStyle={wrapperStyle}
                                                        containerId={containerId}
                                                        getIndex={getIndex}
                                                        task={value}
                                                    />
                                                );
                                            })}
                                        </SortableContext>
                                    </DroppableContainer>
                                ))}
                                {/*{minimal ? undefined : (*/}
                                {/*    <DroppableContainer*/}
                                {/*        id={PLACEHOLDER_ID}*/}
                                {/*        disabled={isSortingContainer}*/}
                                {/*        items={empty}*/}
                                {/*        // onClick={handleAddColumn}*/}
                                {/*        placeholder*/}
                                {/*    >*/}
                                {/*        + Add column*/}
                                {/*    </DroppableContainer>*/}
                                {/*)}*/}
                            </SortableContext>
                        </div>
                        {createPortal(
                            <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
                                {activeId
                                    ? containers.includes(activeId)
                                        ? renderContainerDragOverlay(activeId)
                                        : renderSortableItemDragOverlay(activeId)
                                    : null}
                            </DragOverlay>,
                            document.body
                        )}
                        {trashable && activeId && !containers.includes(activeId) ? (
                            <></>
                        ) : null}
                    </DndContext>
                </div>
            </div>
        </div>
    );
};