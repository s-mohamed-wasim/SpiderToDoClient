export interface Task
{
    taskId: number;
    title: string;
    description?: string;
    status: string;
    createdDate: string;
    modifiedDate?: string;
    userId: number;
}