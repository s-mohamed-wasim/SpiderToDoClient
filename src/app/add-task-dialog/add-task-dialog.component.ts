import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../_services/task.service';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss'
})
export class AddTaskDialogComponent {

  taskForm!: FormGroup;

  constructor(private fb: FormBuilder,private dialogRef: MatDialogRef<AddTaskDialogComponent>
              ,private tasksService : TaskService,@Inject(MAT_DIALOG_DATA) public taskId: number | null) 
  {
    this.taskForm = this.fb.group({
      taskId: [0],
      title: ['', Validators.required],
      description: ['']
    });

    if(taskId)
    {
      this.getTask(taskId);
    }
  }

  getTask(taskId: number | null)
  {
    this.tasksService.getTask(taskId).subscribe({
      next: (response) => {
        console.log(response);
        this.taskForm.patchValue({
          taskId: response.data[0].taskId,
          title: response.data[0].title,
          description: response.data[0].description
        })
      }
    })
  }

  save() {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
