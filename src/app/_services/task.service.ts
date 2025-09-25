import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Task } from '../_models/task';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient: HttpClient) { }

  apiBaseUrl = environment.apiBaseUrl;

  getTasks() : Observable<any>
  {
    return this.httpClient.get<any>(this.apiBaseUrl+'/tasks').pipe(
      map(response => {
        return response;
      })
    )
  }
}
