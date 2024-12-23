import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CommomapiService {
  BaseUrl = environment.basePath;
  constructor(public http:HttpClient) { }
  language(code){
    return this.http.get(this.BaseUrl + 'get-translation?code=' + code);
  }
}
