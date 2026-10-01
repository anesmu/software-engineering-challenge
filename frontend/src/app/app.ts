import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { OrdersListComponent } from './orders-list/orders-list.component';

@Component({
  imports: [RouterOutlet, OrderComponent, OrdersListComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
  protected selectedOrderId = 1;

  onOrderSelected(id: number) {
    this.selectedOrderId = id;
  }
}
