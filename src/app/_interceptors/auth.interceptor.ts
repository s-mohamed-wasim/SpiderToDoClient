import { HttpInterceptorFn } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const userString = localStorage.getItem('user');
  if(userString)
  {
    const token = JSON.parse(userString).token;
    if(token)
    {
      let authReq = req.clone({
        setHeaders:{
          Authorization: `Bearer ${token}`
        }
      })

      return next(authReq);
    }    
  }
  
  return next(req);
};
