import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { UserService } from '../_services/user.service';
import { SnackbarService } from '../_services/snackbar.service';
import { BusyService } from '../_services/busy.service';
import { User } from '../_models/user';
import { ChangeUserStatusModel } from '../_models/changeUserStatusModel';

@Component({
  selector: 'app-application-users',
  templateUrl: './application-users.component.html',
  styleUrl: './application-users.component.scss'
})
export class ApplicationUsersComponent implements OnInit {

  selectAll = false;
  users: any[] = [];
  selectedUserIds: any[] = [];

  constructor(private accountService: AccountService, private userService: UserService, private snackbar: SnackbarService, private busyService: BusyService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.busyService.busy();
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.busyService.idle();
        if (response.out == 1) {
          this.users = response.data;
        }
        else {
          if (response.error) {
            this.snackbar.showError(response.error[0]?.errorMsg, 'top');
          }
        }
      },
      error: (error) => {
        this.busyService.idle();
        this.snackbar.showError(error.message);
      },
      complete: () => { }
    })
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;

    if (this.selectAll) {
      this.users.forEach(users => {
        this.selectedUserIds.push(users.userId);
      });

      this.selectedUserIds = [... new Set(this.selectedUserIds)]; //removing duplicate elements from here
    }
    else {
      this.selectedUserIds = [];
    }
  }

  onUserSelect(event: any, user: any) {
    if (event.checked) {
      let exists = this.selectedUserIds.findIndex(userId => userId == user.userId);
      if (exists == -1) {
        this.selectedUserIds.push(user?.userId);
      }
    }
    else {
      this.selectedUserIds = this.selectedUserIds.filter(userId => userId != user.userId);
    }

    if(this.selectedUserIds.length == this.users.length)
    {
      this.selectAll = true;
    }
    else
    {
      this.selectAll = false;
    }
  }

  changeUserStatus(activity: number, userId: number)
  {
    this.selectedUserIds = [];
    this.selectedUserIds.push(userId);
    this.changeUserStatusBulk(activity);
  }


  changeUserStatusBulk(activity: number) {

    if (this.selectedUserIds.length > 0) {
      let model: ChangeUserStatusModel = {
        Activity: activity,
        UserIds: this.selectedUserIds
      };

      this.busyService.busy();
      this.userService.changeUsersStatus(model).subscribe({
        next: (response) => {
          this.busyService.idle();
          if (response.out == 1) {
            this.snackbar.showSuccess("Updated Successfully");
            this.getAllUsers(); //to refresh the grid
            this.selectAll = false;
            this.selectedUserIds = [];
          }
          else {
            if (response.error) {
              this.snackbar.showError(response.error[0]?.errorMsg, 'top');
            }
          }
        },
        error: (error) => {
          this.busyService.idle();
          this.snackbar.showError(error.message);
        },
        complete: () => { }
      })
    }
    else
    {
      this.snackbar.showError("No Users were selected");
    }
  }


  sendEmail() {
    //send email code will come here
  }

}
