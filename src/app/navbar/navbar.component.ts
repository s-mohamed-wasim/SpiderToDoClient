import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ThemeService } from '../_services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  availableThemes = [
    { name: 'Blue', color: 'rgb(56, 112, 167)' },
    { name: 'Orange', color: 'rgb(233 127 64 / 90%)' },
    { name: 'Pink', color: 'rgb(223 93 147 / 77%)' },
    { name: 'Green', color: 'rgb(58 167 132)' }
  ];

  constructor(public accountService: AccountService, private router: Router, private themeService: ThemeService) { }

  ngOnInit() {

  }

  logout() {
    this.router.navigate(['/']);
    this.accountService.logout();
  }

  changeTheme(color: string) {
    this.themeService.setTheme(color);
  }
}
