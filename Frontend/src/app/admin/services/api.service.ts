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
  dashboardData() {
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
    return this.http.post(this.AdminBaseUrl + 'add-regaykar-user', data);
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

  getSalesList(){
    return this.http.get(this.AdminBaseUrl + 'get-objects-list');
  }
  
  changePassword(data){
    return this.http.post(this.AdminBaseUrl + 'change-password', data);
  }


  // Admin Api
  getAdminServers() {
    return this.http.get(this.AdminBaseUrl + 'get-admin-servers');
  }
  getAdminrRegaykarList() {
    return this.http.get(this.AdminBaseUrl + 'get-admin-regaykar-usrs');
  }
  getAdminrSalesList() {
    return this.http.get(this.AdminBaseUrl + 'get-admin-objects-list');
  }

  // 
  loginAsUser(user_id:any){
    return this.http.post(this.AdminBaseUrl + 'masquerade/' + user_id, {});
  }

}
