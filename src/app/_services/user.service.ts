import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  	constructor(private httpClient: HttpClient) { }
  
    apiBaseUrl = environment.apiBaseUrl;

    getUser() : Observable<any>
    {
      return this.httpClient.get<any>(this.apiBaseUrl+'/users/get').pipe(
        map(response => {
          return response;
        })
      )
    }

    getAllUsers() : Observable<any>
    {
      return this.httpClient.get<any>(this.apiBaseUrl+'/users/get/all').pipe(
        map(response => {
          return response;
        })
      )
    }

    changeUsersStatus(model: any) : Observable<any>
    {
      return this.httpClient.post<any>(this.apiBaseUrl+'/users/change/status',model).pipe(
        map(response => {
          return response;
        })
      )
    }

    updateUser(model: any) : Observable<any>
    {
      return this.httpClient.post<any>(this.apiBaseUrl+'/users/update',model).pipe(
        map(response => {
          return response;
        })
      )
    }
  
    addPhoto(formData: any) : Observable<any>
    {
      return this.httpClient.post<any>(this.apiBaseUrl+'/users/add-photo',formData).pipe(
        map(response => {
          return response;
        })
      )
    }

    deletePhoto(model: any) : Observable<any>
    {
      return this.httpClient.post<any>(this.apiBaseUrl+'/users/delete-photo',model).pipe(
        map(response => {
          return response;
        })
      )
    }
}
