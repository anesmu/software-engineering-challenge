import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order',
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styles: [
    `
      .order-box {
        border: 1px solid #ccc;
        padding: 16px;
        margin: 16px;
      }
      .status-pending {
        color: orange;
      }
      .status-shipped {
        color: green;
      }
      .status-other {
        color: gray;
      }
    `,
  ],
})
export class OrderComponent implements OnInit {
  order: any;
  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.orderService.getOrder(1).subscribe((data: any) => {
      console.log('order data', data);
      this.order = data;

      let subtotal = 0;
      for (let i = 0; i < data.items.length; i++) {
        subtotal = subtotal + data.items[i].unitPrice * data.items[i].quantity;
      }
      this.subtotal = subtotal;

      if (subtotal > 100) {
        this.tax = subtotal * 0.21;
      } else {
        this.tax = subtotal * 0.1;
      }

      this.total = this.subtotal + this.tax;
      this.cdr.detectChanges();
    });
  }

  getStatusClass() {
    return this.order?.status === 'PENDING'
      ? 'status-pending'
      : this.order?.status === 'SHIPPED'
        ? 'status-shipped'
        : 'status-other';
  }
}
