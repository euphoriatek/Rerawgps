import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  BaseUrl = environment.basePath;
  AdminBaseUrl = environment.AdminbasePath;
  constructor(public http: HttpClient) { }
  login(data: any) {
    return this.http.post(this.AdminBaseUrl + 'login', data);
  }

  addServer(data: any) {
    return this.http.post(this.AdminBaseUrl + 'add-server', data);
  }

  updateServer(id: number, data: any) {
    return this.http.post(`${this.AdminBaseUrl}edit-server/${id}`, data);
  }
  updateUser(id: number, data: any) {
    return this.http.post(`${this.AdminBaseUrl}edit-user/${id}`, data);
  }

  getServers() {
    return this.http.get(this.AdminBaseUrl + 'get-servers');
  }

  addAdminUser(data:any){
    return this.http.post(this.AdminBaseUrl + 'add-admin-usr', data);
  }

  getAdminUsers(){
    return this.http.get(this.AdminBaseUrl + 'get-admin-usr');
  }

  deleteServer(serverId) {
    return this.http.post(this.AdminBaseUrl + 'delete-server', { server_id: serverId });
  }
  deleteUser(id: number) {
    return this.http.delete(this.AdminBaseUrl + 'delete-user/' + id);
  }

  addUser(data: any) {
    return this.http.post(this.AdminBaseUrl + 'register', data);
  }
  getUserList() {
    return this.http.get(this.AdminBaseUrl + 'users-list');
  }

  getUsers() {
    return this.http.get(this.AdminBaseUrl + 'users');
  }

  logout() {
    return this.http.post(this.AdminBaseUrl + 'logout', '');
  }

  addSalesAgent(data: any) {
    return this.http.post(this.AdminBaseUrl + 'add-object', data);
  }
}
