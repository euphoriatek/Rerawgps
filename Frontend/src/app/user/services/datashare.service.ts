import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DatashareService {
  private dataSource = new BehaviorSubject<any>('');
  data = this.dataSource.asObservable();
  constructor() { }
  updateData(newData: any) {
    this.dataSource.next(newData);
  }
}