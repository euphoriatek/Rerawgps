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

  getSalesAgent(){
    return this.http.get(this.BaseUrl + 'get-object-list');
  }
}
