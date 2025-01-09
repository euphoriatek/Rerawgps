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
  updateStatus(user_id:number){
    return this.http.post(this.AdminBaseUrl + 'update-user-status', {user_id:user_id});
  }
  // SupeR Admin Dashboard
  getServersList() {
    return this.http.get(this.AdminBaseUrl + 'dashboard-data');
  }

  addServer(data: any) {
    return this.http.post(this.AdminBaseUrl + 'add-server', data);
  }

  updateServer(data: any) {
    return this.http.post(this.AdminBaseUrl + 'update-server', data);
  }

  getServers() {
    return this.http.get(this.AdminBaseUrl + 'get-servers');
  }

  deleteServer(serverId) {
    return this.http.post(this.AdminBaseUrl + 'delete-server', { server_id: serverId });
  }
  
  updateUser(data: any) {
    return this.http.post(this.AdminBaseUrl + 'edit-regaykar-user', data);
  }

  addAdminUser(data:any){
    return this.http.post(this.AdminBaseUrl + 'add-admin-usr', data);
  }

  getAdminUsers(){
    return this.http.get(this.AdminBaseUrl + 'get-admin-usr');
  }

  
  deleteUser(id: number) {
    return this.http.delete(this.AdminBaseUrl + 'delete-regaykar-user/' + id);
  }

  addUser(data: any) {
    return this.http.post(this.AdminBaseUrl + 'regaykar-user', data);
  }
  
  getUserList() {
    return this.http.get(this.AdminBaseUrl + 'users-list');
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

  getUserInfo(data){
    return this.http.post(this.AdminBaseUrl + 'get-user-info', {user_id:data});
  }

  // Admin Api

  getAdminServers() {
    return this.http.get(this.AdminBaseUrl + 'get-admin-servers');
  }

  getAdminUserList() {
    return this.http.get(this.AdminBaseUrl + 'get-admin-users-list');
  }
}
