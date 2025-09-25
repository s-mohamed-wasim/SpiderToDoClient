import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from './_services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'SpiderToDoClient';
  showSignUpForm: boolean = false;
  @ViewChild(SignupComponent) signupComp!: SignupComponent;
  @ViewChild(LoginComponent) loginComp!: LoginComponent; 

  constructor(public accountService: AccountService) {

  }

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }


  logout() {
    this.accountService.logout();
  }

  toggleFormFlag() {
    this.showSignUpForm = !this.showSignUpForm;
    if(this.loginComp)
    {
      this.loginComp.loginForm.reset();
    }
    if(this.signupComp)
    {
      this.signupComp.signupForm.reset();
    }
  }
}
