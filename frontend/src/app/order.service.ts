import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrders(): any {
    return this.http.get('http://localhost:8080/api/orders');
  }

  getOrder(id: number): any {
    return this.http.get('http://localhost:8080/api/orders/' + id);
  }
}
