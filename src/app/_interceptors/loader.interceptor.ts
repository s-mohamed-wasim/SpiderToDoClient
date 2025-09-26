import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay, finalize } from 'rxjs';
import { BusyService } from '../_services/busy.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {

  const busyService = inject(BusyService);


  busyService.busy();

  return next(req).pipe(
    delay(1000),
    finalize(() => busyService.idle())
  );
};
