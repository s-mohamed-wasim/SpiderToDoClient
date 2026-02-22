export interface Task {
    taskId: number;
    title: string;
    description?: string;
    dueDate?: string | Date | null;
    status: string;
    displayOrder: number;
    createdDate: string;
    modifiedDate?: string;
    userId: number;
}