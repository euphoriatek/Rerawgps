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
  updateUser(data: any) {
    return this.http.post(this.AdminBaseUrl + 'edit-user', data);
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
  getUserList(type: any = null) {
    const url = this.AdminBaseUrl + 'users-list';
    const params = type ? { type } : {};
    return this.http.get(url, { params });
  }

  logout() {
    return this.http.post(this.AdminBaseUrl + 'logout', '');
  }

  addSalesAgent(data: any) {
    return this.http.post(this.AdminBaseUrl + 'add-object', data);
  }

  editAdminUser(data: any){
    return this.http.post(this.AdminBaseUrl + 'edit-admin-user', data);
  }

  deleteAdminUser(id: number) {
    return this.http.post(this.AdminBaseUrl + 'delete-admin-user', { id: id });
  }

  addGroup(data: any) {
    return this.http.post(this.AdminBaseUrl + 'create-group', data);
  }

  getSales(id:number){
    return this.http.post(this.AdminBaseUrl + 'get-objects', {user_id:id});
  }

  updateSales(data){
    return this.http.post(this.AdminBaseUrl + 'update-objects', data);
  }

  deleteSales(data){
    return this.http.delete(this.AdminBaseUrl + 'delete-object/' +data);
  }

  getServersList() {
    return this.http.get(this.AdminBaseUrl + 'get-servers-list');
  }

  getUserInfo(data){
    return this.http.post(this.AdminBaseUrl + 'get-user-info', {user_id:data});
  }

  // Admin Api

  getAdminServers() {
    return this.http.get(this.AdminBaseUrl + 'get-admin-servers');
  }

  getAdminUserList(type: any = null) {
    const url = this.AdminBaseUrl + 'get-admin-users-list';
    const params = type ? { type } : {};
    return this.http.get(url, { params });
  }
}
