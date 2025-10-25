import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { Task } from '../_models/task';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { ConfirmDialogComponent } from '../_shared/confirm-dialog/confirm-dialog.component';
import { BusyService } from '../_services/busy.service';
import { SnackbarService } from '../_services/snackbar.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedTab: 'Pending' | 'Completed' = 'Pending';
  canDrag = false;
  private holdTimer: any;

  constructor(private tasksService: TaskService, private toastr: ToastrService, private dialog: MatDialog
    , private busyService: BusyService, private snackbar: SnackbarService, private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllTasks();
  }

  getAllTasks() {
    this.busyService.busy();
    this.tasksService.getTasks().subscribe({
      next: response => {
        this.busyService.idle();
        this.tasks = response?.data || [];
         this.filterTasks();
      },
      error: error => {
        this.busyService.idle();
        this.toastr.error(error);
        console.log(error);
      },
      complete: () => { }
    })
  }

  filterTasks() {
  this.filteredTasks = this.tasks.filter(t => t.status === this.selectedTab);
  }


  // get filteredTasks(): Task[] {
  //   return this.tasks.filter(task => task.status === this.selectedTab);
  // }

  addTask() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '400px',
      data: { title: 'Add New Task', message: '', taskId: 0 }
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
      data: { title: 'Edit Task', message: '', taskId: taskId }
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
        this.cdr.detectChanges();
        console.log(response);
        this.snackbar.showInfo(message);
        this.filterTasks();
      },
      error: error => {
        console.log(error);
        this.snackbar.showError(message);
      },
      complete: () => { }
    })
  }

  getPendingTasksCount() {
    return this.tasks.filter(t => t.status === 'Pending').length;
  }

  getCompletedTasksCount() {
    return this.tasks.filter(t => t.status === 'Completed').length;
  }

  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.filteredTasks, event.previousIndex, event.currentIndex);
  // }

  drop(event: CdkDragDrop<Task[]>) {
    this.updateDisplayOrderInDataBase(event.previousIndex, event.currentIndex);

    const filtered = this.filteredTasks;

    moveItemInArray(filtered, event.previousIndex, event.currentIndex);

    // Reflect updated order back to main tasks array
    const updated = this.tasks.filter(t => t.status !== this.selectedTab);
    this.tasks = [...updated, ...filtered];

    this.cdr.detectChanges();

  }

  updateDisplayOrderInDataBase(prevInd: number, curInd: number)
  {
    let model = {FirstTaskId:-1,SecondTaskId:-1};
    model.FirstTaskId = this.filteredTasks[prevInd].taskId;
    model.SecondTaskId = this.filteredTasks[curInd].taskId;

    this.tasksService.updateTasksDisplayOrder(model).subscribe({
      next: (response) => {
        if(response.out == 1)
        {
          console.log(response);
        }
        else {
          if (response.error) {
            this.snackbar.showError(response.error[0]?.errorMsg,'top');
          }
        }
      },
      error: (error) => {
        console.log(error.message);
      },
      complete: () => {}
    })
  }

  
  onHoldStart(event: Event) {
    // Prevent accidental scroll-drag conflict
    event.stopPropagation();

    // Start 1-second timer
    this.holdTimer = setTimeout(() => {
      this.canDrag = true;
    }, 1000); // adjust to 1500 or 2000 ms if you want 1.5–2 seconds
  }

  onHoldEnd() {
    // Cancel timer if user releases early
    clearTimeout(this.holdTimer);

    // Small delay to allow one drag before disabling again
    setTimeout(() => {
      this.canDrag = false;
    }, 500);
  }

}
