import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  constructor(public accountService : AccountService){}

  ngOnInit()
  {

  }

  logout()
  {
    this.accountService.logout();
  }

}
