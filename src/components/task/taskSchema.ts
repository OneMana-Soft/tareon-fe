import { z } from "zod"


export const taskSchema = z.object({
    task_uuid: z.string(),
    task_name: z.string(),
    task_status: z.string(),
    task_label: z.string().optional(),
    task_priority: z.string(),
    task_start_date: z.string().optional(),
    task_due_date: z.string().optional(),
    task_project: z.object({
        uid: z.string(),
        project_uuid: z.string(),
        project_name: z.string(),
    }),
    task_team: z.object({
        team_uuid: z.string(),
        team_name: z.string(),
    }),
    task_assignee: z.object({
        user_uuid: z.string(),
        user_name: z.string(),
    }),
    task_created_at: z.string(),
    task_sub_task_count: z.number().optional(),
    task_comment_count: z.number().optional(),
});


export type Task = z.infer<typeof taskSchema>