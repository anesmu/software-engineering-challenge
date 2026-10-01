import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrder(id: number): any {
    return this.http.get('http://localhost:8080/api/orders/' + id);
  }
}
