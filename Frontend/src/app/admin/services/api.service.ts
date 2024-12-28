import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  BaseUrl = environment.basePath;
  AdminBaseUrl = environment.AdminbasePath;
  constructor(public http:HttpClient) { }
  login(data:any){
    return this.http.post(this.AdminBaseUrl + 'login', data);
  }

  addUser(data:any){
    return this.http.post(this.AdminBaseUrl + 'register', data);
  }
  getUserList(){
    return this.http.get(this.AdminBaseUrl + 'users-list');
  }

  getUsers(){
    return this.http.get(this.AdminBaseUrl + 'users');
  }

  logout(){
    return this.http.post(this.AdminBaseUrl + 'logout','');
  }

  addSalesAgent(data:any){
    return this.http.post(this.AdminBaseUrl + 'add-object',data);
  }
}
