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
  // Groups
  addGroup(data: any) {
    return this.http.post(this.BaseUrl + 'create-group', data);
  }
  getGroupList() {
    return this.http.get(this.BaseUrl + 'get-group-list');
  }
  updateGroup(data){
    return this.http.post(this.BaseUrl + 'edit-group',data);
  }
  deleteGroupUser(id: number) {
    return this.http.delete(this.BaseUrl + 'delete-group/' + id);
  }
  getSalesOptionsList(){
    return this.http.get(this.BaseUrl + 'get-sales-options');
  }
  getAllPoisOptionsList(){
    return this.http.get(this.BaseUrl + 'get-pois-options');
  }
  // Sales
  getSales(){
    return this.http.post(this.BaseUrl + 'get-sales-objects', {});
  }
  getPendingPois(){
    return this.http.get(this.BaseUrl + 'pending-pois');
  }
  addPois(data: any) {
    return this.http.post(this.BaseUrl+'pois', data);
  }
  editPoi(data: any) {
    return this.http.post(this.BaseUrl+'edit-poi', data);
  }
  getAllPois(){
    return this.http.get(this.BaseUrl + 'pois');
  }
  updatePoiStatus(data:any){
    return this.http.post(this.BaseUrl + 'poi-update-status', data);;
  }
  syncPois(){
    return this.http.get(this.BaseUrl + 'sync-data');;
  }
  // Plans
  getPlans(){
    return this.http.get(this.BaseUrl + 'get-regaykar-plans');
  }
  createPlan(data:any){
    return this.http.post(this.BaseUrl + 'create-plan', data);
  }
  updatePlan(data:any){
    return this.http.post(this.BaseUrl + 'update-plan', data);
  }
  deletePlan(id: number) {
    return this.http.delete(this.BaseUrl + 'delete-plan/' + id);
  }
  getHistory(){
    return this.http.get(this.BaseUrl + 'get-history');
  }
  
}
