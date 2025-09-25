import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { Task } from '../_models/task';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  selectedTab: 'Pending' | 'Completed' = 'Pending';

  constructor(private tasksService: TaskService, private toastr: ToastrService){}

  ngOnInit(): void {
    this.getAllTasks();    
  }

  getAllTasks()
  {
    this.tasksService.getTasks().subscribe({
      next: response => {
        this.tasks = response?.data;
      },
      error: error => {
        this.toastr.error(error);
        console.log(error);
      },
      complete: () => {}
    })
  }
  
  
  get filteredTasks(): Task[] {
    return this.tasks.filter(task => task.status === this.selectedTab);
  }

  addTask() {
    console.log('Add task clicked');
    // TODO: open dialog
  }

  editTask(task: Task) {
    console.log('Edit task:', task);
    // TODO: implement edit
  }

  deleteTask(task: Task) {
    console.log('Delete task:', task);
    // TODO: call delete API
    this.tasks = this.tasks.filter(t => t.taskId !== task.taskId);
  }

}
