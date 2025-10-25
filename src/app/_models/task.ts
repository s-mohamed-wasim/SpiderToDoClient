export interface Task
{
    taskId: number;
    title: string;
    description?: string;
    status: string;
    displayOrder: number;
    createdDate: string;
    modifiedDate?: string;
    userId: number;
}