import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  constructor(public accountService : AccountService,private router: Router){}

  ngOnInit()
  {

  }

  logout()
  {
    this.router.navigate(['/']);
    this.accountService.logout();
  }

}
