import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../_services/snackbar.service';
import { AccountService } from '../_services/account.service';
import { BusyService } from '../_services/busy.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {

  token: string | null = null;
  email: string = '';
  resetPasswordForm! : FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(private route: ActivatedRoute, private snackbar: SnackbarService, private accountService: AccountService
    , private busyService: BusyService, private fb: FormBuilder, private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['',[Validators.required]]
    },{
      validators: [this.passwordMatchValidator]
    })
  }

  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
  
  ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
		  this.token = params['token'];  
		  this.email = params['email'];  
		});
	}

  resetPassword()
  {
    let model = {Email:'',NewPassword:''};
    model.Email = this.email;
    model.NewPassword = this.resetPasswordForm.get('password')?.value;

    this.busyService.busy();
    this.accountService.resetPassword(model,this.token).subscribe({
      next: (response) => {
        this.busyService.idle();
        if (response.out == 1) {
          this.snackbar.showSuccess('Password updated successfully','top');
          this.resetPasswordForm.reset();          
          this.router.navigate(['/']);
        
        }
        else {
          if (response.error) {
            this.snackbar.showError(response.error[0]?.errorMsg,'top');
          }
        }
      },
      error: (error) => {
        this.busyService.idle();
        this.snackbar.showError(error);
      },
      complete: () => {}
    })
  }
	
}
