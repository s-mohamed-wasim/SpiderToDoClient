import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  hidePassword = true;

  constructor(public accountService: AccountService, private fb: FormBuilder, private toastr: ToastrService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {

  }

  login() {

    let model = { Email: '', Password: '' };

    model.Email = this.loginForm.get('email')?.value;
    model.Password = this.loginForm.get('password')?.value;

    this.accountService.login(model).subscribe({
      next: response => {
        console.log(response);
        if (response.out == 1) {
          this.toastr.success('login successful');
          this.loginForm.reset();          
          this.router.navigate(['tasks']);
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
    })
  }

}
