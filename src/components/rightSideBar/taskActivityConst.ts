type TaskActivityKey = {
    key: string;
};

export const taskActivityConst: Record<string, TaskActivityKey> = {
    "nameUpdate": {
        "key": "updatedTaskName",
    },
    "labelUpdate": {
        "key": "updatedTaskLabel",
    },
    "statusUpdate": {
        "key": "updatedTaskStatus",
    },
    "priorityUpdate": {
        "key": "updatedTaskPriority",
    },
    "assigneeUpdate": {
        "key": "updatedTaskAssignee",
    },
    "startDateUpdate": {
        "key": "updatedTaskStartDate",
    },
    "endDateUpdate": {
        "key": "updatedTaskDueDate",
    },
    "descUpdate": {
        "key": "updatedTaskDesc",
    },
    "attachmentAdd": {
        "key": "addedTaskAttachment",
    },
    "attachmentRemove": {
        "key": "removedTaskAttachment",
    },
    "subTaskAdd": {
        "key": "addedTaskSubTask",
    },
    "subTaskDelete": {
        "key": "deletedTaskSubTask",

    },
    "subTaskUnDelete": {
        "key": "unDeletedTaskSubTask",
    },
    "commentAdd": {
        "key": "addedTaskComment",
    },
    "commentUpdate": {
        "key": "updateTaskComment",

    },
    "commentDelete": {
        "key": "deleteTaskComment",
    },
    "taskDelete": {
        "key": "updateTaskDelete",
    },
    "taskUnDelete": {
        "key": "updateTaskUnDelete",
    },
    "taskCreate": {
        "key": "updateTaskCreate",
    }
};
