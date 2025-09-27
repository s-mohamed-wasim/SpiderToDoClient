import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string,verticalPosition: MatSnackBarVerticalPosition = 'bottom' , duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'center', //possible values: 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: verticalPosition //possible values: 'top' | 'bottom'
    });
  }

  showError(message: string,verticalPosition: MatSnackBarVerticalPosition = 'bottom' , duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'center', //possible values: 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: verticalPosition //possible values: 'top' | 'bottom'
    });
  }

  showInfo(message: string,verticalPosition: MatSnackBarVerticalPosition = 'bottom' , duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['snackbar-info'],
      horizontalPosition: 'center', //possible values: 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: verticalPosition //possible values: 'top' | 'bottom'
    });
  }
}
