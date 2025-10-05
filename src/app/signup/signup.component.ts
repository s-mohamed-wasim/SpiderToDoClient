import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BusyService } from '../_services/busy.service';
import { SnackbarService } from '../_services/snackbar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  hidePassword = true;

  constructor(public accountService: AccountService, private fb: FormBuilder, private toastr: ToastrService
              ,private router: Router, private busyService: BusyService,private snackbar: SnackbarService) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {

  }

  createAccount() {
    let model = { FullName: '', Email: '', Password: '' };

    model.FullName = this.signupForm.get('fullName')?.value;
    model.Email = this.signupForm.get('email')?.value;
    model.Password = this.signupForm.get('password')?.value;

    this.busyService.busy();
    this.accountService.signup(model).subscribe({
      next: response => {
        this.busyService.idle();
        console.log(response);
        if (response.out == 1) {
          //this.toastr.info('user created successfullly');
          this.snackbar.showInfo('user created successfully','top');
          this.signupForm.reset();
          this.router.navigate(['/']);
        }
        else {
          if (response.error) {
            // this.toastr.error(response.error[0]?.errorMsg);
            this.snackbar.showError(response.error[0]?.errorMsg);
          }
        }
      },
      error: error => {
        this.busyService.idle();
        this.toastr.error(error);
        console.log(error);
      },
      complete: () => { }
    });
  }

}
