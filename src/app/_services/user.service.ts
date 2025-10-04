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
