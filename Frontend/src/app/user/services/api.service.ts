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

  addGroup(data: any) {
    return this.http.post(this.BaseUrl + 'create-group', data);
  }
  getGroupList() {
    return this.http.get(this.BaseUrl + 'get-group-users-list');
  }
  updateGroup(data){
    return this.http.post(this.BaseUrl + 'edit-group-user',data);
  }
  deleteGroupUser(id: number) {
    return this.http.delete(this.BaseUrl + 'delete-group-user/' + id);
  }
  getSales(id:number){
    return this.http.post(this.BaseUrl + 'get-sales-objects', {user_id:id});
  }
  getPendingPois(){
    return this.http.get(this.BaseUrl + 'pending-pois');
  }
  addPois(data: any) {
    return this.http.post(this.BaseUrl+'pois', data);
  }
  getAllPois(){
    return this.http.get(this.BaseUrl + 'pois');
  }
}
