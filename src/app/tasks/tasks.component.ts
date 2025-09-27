import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { Task } from '../_models/task';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { ConfirmDialogComponent } from '../_shared/confirm-dialog/confirm-dialog.component';
import { BusyService } from '../_services/busy.service';
import { SnackbarService } from '../_services/snackbar.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  selectedTab: 'Pending' | 'Completed' = 'Pending';

  constructor(private tasksService: TaskService, private toastr: ToastrService, private dialog: MatDialog
              ,private busyService: BusyService, private snackbar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.getAllTasks();
  }

  getAllTasks() {
    this.busyService.busy();
    this.tasksService.getTasks().subscribe({
      next: response => {
        this.busyService.idle();
        this.tasks = response?.data;
      },
      error: error => {
        this.busyService.idle();
        this.toastr.error(error);
        console.log(error);
      },
      complete: () => { }
    })
  }


  get filteredTasks(): Task[] {
    return this.tasks.filter(task => task.status === this.selectedTab);
  }

  addTask() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '400px',
      data: {title:'Add New Task',message:'',taskId:0}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newTask: Partial<Task> = {
          title: result.title,
          description: result.description,
        };

        this.tasksService.createTask(newTask).subscribe({
          next: (created) => {
            //this.toastr.success("Created Successfully");
            this.snackbar.showSuccess('Task created successfully');
            this.getAllTasks();
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => { }
        });
      }
    });
  }

  editTask(taskId: number) {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '400px',
      data: {title:'Edit Task',message:'',taskId:taskId}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedTask: Partial<Task> = {
          taskId: result.taskId,
          title: result.title,
          description: result.description,
        };

        this.tasksService.updateTask(updatedTask).subscribe({
          next: (created) => {
            //this.toastr.success("Task updated successfully");
            this.snackbar.showSuccess('Task updated successfully');
            this.getAllTasks();
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => { }
        });
      }
    });
  }

  deleteTask(taskId: number) {
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this task?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.tasks = this.tasks.filter(t => t.taskId !== taskId);

        let model = { taskId: taskId };
        this.tasksService.deleteTask(model).subscribe({
          next: (response) => {
            console.log(response);
            //this.toastr.success("Deleted Successfully");
            this.snackbar.showSuccess('Task deleted successfully');
            this.getAllTasks();
          },
          error: (error) => {
            console.log(error.error);
          },
          complete: () => { }
        })

      }
    });
  }

  toggleTaskStatus(task: Task) {

    let model = { Activity: -1, TaskIds: [task.taskId] };
    let message = '';



    if (task.status === 'Pending') {
      model.Activity = 1;
      message = 'Task marked as Completed';
      task.status = 'Completed';
    } else {
      model.Activity = 2;
      message = 'Task marked as Pending';
      task.status = 'Pending';
    }

    this.tasksService.changeTasksStatus(model).subscribe({
      next: response => {
        console.log(response);
        this.snackbar.showInfo(message);
      },
      error: error => {
        console.log(error);
        this.snackbar.showError(message);
      },
      complete: () => { }
    })
  }

  getPendingTasksCount()
  {
    return this.tasks.filter(t => t.status === 'Pending').length;
  }

  getCompletedTasksCount()
  {
    return this.tasks.filter(t => t.status === 'Completed').length;
  }

}
