import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {

  const accountService = inject(AccountService); //since this guard is method and not a class, we can't use constructor
  const toastr = inject(ToastrService);
  const router = inject(Router);

  if(accountService.currentUser())
  {
    return true;
  }
  else
  {
    toastr.error('You are unathorized!');
    router.navigate(['/']);
    return false;
  }
};
