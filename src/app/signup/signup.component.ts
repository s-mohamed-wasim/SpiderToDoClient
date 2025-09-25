import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  hidePassword = true;
  @Output() formRedirectEvent = new EventEmitter<void>();

  constructor(public accountService: AccountService, private fb: FormBuilder, private toastr: ToastrService) {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
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
    this.accountService.signup(model).subscribe({
      next: response => {
        console.log(response);
        if (response.out == 1) {
          this.toastr.info('user created successfullly');
          this.signupForm.reset();
          this.redirectToLoginForm();
        }
        else {
          if (response.error) {
            this.toastr.error(response.error[0]?.errorMsg);
          }
        }
      },
      error: error => {
        this.toastr.error(error);
        console.log(error);
      },
      complete: () => { }
    });
  }

  redirectToLoginForm() {
    this.formRedirectEvent.emit();
  }

}
