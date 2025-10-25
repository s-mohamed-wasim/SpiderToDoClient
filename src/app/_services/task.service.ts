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

  getTask(taskId: any) : Observable<any>
  {
    return this.httpClient.get<any>(this.apiBaseUrl+'/tasks/'+taskId).pipe(
      map(response => {
        return response;
      })
    )
  }

  changeTasksStatus(model: any) : Observable<any>
  {
    return this.httpClient.post<any>(this.apiBaseUrl+'/tasks/change/status',model).pipe(
      map(response => {
        return response;
      })
    )
  }

  createTask(model: any) : Observable<any>
  {
    return this.httpClient.post<any>(this.apiBaseUrl+'/tasks/create',model).pipe(
      map(response => {
        return response;
      })
    )
  }

  updateTask(model: any) : Observable<any>
  {
    return this.httpClient.post<any>(this.apiBaseUrl+'/tasks/update',model).pipe(
      map(response => {
        return response;
      })
    )
  }

  updateTasksDisplayOrder(model: any) : Observable<any>
  {
    return this.httpClient.post<any>(this.apiBaseUrl+'/tasks/update/displayorder',model).pipe(
      map(response => {
        return response;
      })
    )
  }

  deleteTask(model: any) : Observable<any>
  {
    return this.httpClient.post<any>(this.apiBaseUrl+'/tasks/delete',model).pipe(
      map(response => {
        return response;
      })
    )
  }
}
