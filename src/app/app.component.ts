import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'SpiderToDoClient';
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  hidePassword = true;

  showSignUpForm: boolean = false;

  constructor(public accountService: AccountService,private fb: FormBuilder){
    this.loginForm = this.fb.group({
      email: ['',[Validators.required,Validators.email]],
      password: ['',[Validators.required]]
    })

    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit()
  {
    this.setCurrentUser();
  }

  setCurrentUser()
  {
    const userString = localStorage.getItem('user');
    if(!userString) return;

    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }

  login()
  {
    //alert(JSON.stringify(this.loginForm.value));
    let model = {Email:'',Password:''};

    model.Email = this.loginForm.get('email')?.value;
    model.Password = this.loginForm.get('password')?.value;
    
    this.accountService.login(model).subscribe({
      next: response => {
        console.log(response);
        if(response.out == 1)
        {
          alert('login successful')
          this.loginForm.reset();
        }
        else
        {
          if(response.error)
          {
            alert(response.error[0]?.errorMsg);
          }
        }
      },
      error: error => {
        console.log(error)
      }
    })
  }

  logout()
  {
    this.accountService.logout();
  }

  createAccount()
  {
    let model = {FullName:'',Email:'',Password:''};

    model.FullName = this.signupForm.get('fullName')?.value;
    model.Email = this.signupForm.get('email')?.value;
    model.Password = this.signupForm.get('password')?.value;
    this.accountService.signup(model).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.log(error)
      },
      complete: () => {
        alert("user created successfullly");
        this.signupForm.reset();
        this.toggleSignUpFormFlag();
      }
    });
  }

  toggleSignUpFormFlag()
  {
    this.showSignUpForm = !this.showSignUpForm;
  }
}
