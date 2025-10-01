import { HttpInterceptorFn } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const alreadyHasBearer = req.headers.get('Authorization') &&
    req.headers.get('Authorization')?.startsWith('Bearer ');

  if (!alreadyHasBearer) {
    const userString = localStorage.getItem('user');
    if (userString) {
      const token = JSON.parse(userString).token;
      if (token) {
        let authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })

        return next(authReq);
      }
    }
    else
    {
        return next(req); 
    }
  }
  return next(req);
};
