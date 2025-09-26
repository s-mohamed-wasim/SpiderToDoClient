import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from './_services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'SpiderToDoClient';

  constructor(public accountService: AccountService,private router: Router) {

  }

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
    this.router.navigate(['/tasks']);
  }


  logout() {
    this.accountService.logout();
  }
}
