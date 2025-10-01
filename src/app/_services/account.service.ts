import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  apiBaseUrl = environment.apiBaseUrl;
  currentUser = signal<User | null>(null);

  login(model: any) 
  {
    return this.http.post<any>(this.apiBaseUrl+'/auth/login',model).pipe(
      map(response => {
        if(response && response.out == 1)
        {
          localStorage.setItem('user',JSON.stringify(response.data[0]));
          this.currentUser.set(response.data[0]);
        }
        return response;
      })
    )
  }

  signup(model: any)
  {
    return this.http.post<any>(this.apiBaseUrl+'/auth/register',model).pipe(
      map(response => {
        return response;
      })
    )
  }

  createForgotPasswordRequest(model: any)
  {
    return this.http.post<any>(this.apiBaseUrl+'/auth/forgot-password',model).pipe(
      map(response => {
        return response;
      })
    )
  }

  resetPassword(model: any,token: string | null)
  {
    const headers =  new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiBaseUrl+'/auth/reset-password',model,{headers}).pipe(
      map(response => {
        return response;
      })
    )
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
