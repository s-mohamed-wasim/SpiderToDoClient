import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BusyService } from '../_services/busy.service';
import { SnackbarService } from '../_services/snackbar.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  forgotPasswordForm!: FormGroup;
  isPasswordResetRequestSent: boolean = false;

  constructor(private snackbar: SnackbarService, private fb: FormBuilder, private accountService: AccountService, private busyService: BusyService){
        this.forgotPasswordForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
        })
  }


  forgotPasswordRequest()
  {
    let model = {Email:''};
    model.Email = this.forgotPasswordForm.get('email')?.value;

    this.busyService.busy();
    this.accountService.createForgotPasswordRequest(model).subscribe({
      next: (response) => {
        this.busyService.idle();
        if (response.out == 1) {
          this.snackbar.showInfo('Request Sent','top');
          this.isPasswordResetRequestSent = true;
          this.forgotPasswordForm.reset();
        }
        else {
          if (response.error) {
            this.snackbar.showError(response.error[0]?.errorMsg,'top');
          }
          else
          {
            this.snackbar.showError(response.message,'top');
          }
        }
      },
      error: (error) => {
        this.busyService.idle();
      },
      complete: () => {}
    })
  }
}
