import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { Task } from '../_models/task';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { ConfirmDialogComponent } from '../_shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  selectedTab: 'Pending' | 'Completed' = 'Pending';

  constructor(private tasksService: TaskService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllTasks();
  }

  getAllTasks() {
    this.tasksService.getTasks().subscribe({
      next: response => {
        this.tasks = response?.data;
      },
      error: error => {
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
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newTask: Partial<Task> = {
          title: result.title,
          description: result.description,
        };

        this.tasksService.createTask(newTask).subscribe({
          next: (created) => {
            this.toastr.success("Created Successfully");
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
      data: taskId
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
            this.toastr.success("Updated Successfully");
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
            this.toastr.success("Deleted Successfully");
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

    if (task.status === 'Pending') {
      model.Activity = 1;
      task.status = 'Completed';
    } else {
      model.Activity = 2;
      task.status = 'Pending';
    }

    this.tasksService.changeTasksStatus(model).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.log(error);
      },
      complete: () => { }
    })
  }

}
