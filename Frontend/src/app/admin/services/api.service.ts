import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  BaseUrl = environment.basePath;
  constructor(public http:HttpClient) { }
  login(data:any){
    return this.http.post(this.BaseUrl + 'login', data);
  }

  addUser(data:any){
    return this.http.post(this.BaseUrl + 'register', data);
  }
  getUserList(){
    return this.http.get(this.BaseUrl + 'users-list');
  }

  getUsers(){
    return this.http.get(this.BaseUrl + 'users');
  }

  logout(){
    return this.http.post(this.BaseUrl + 'admin-logout','');
  }
}
