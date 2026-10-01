import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order',
  imports: [CommonModule, MatCardModule, MatChipsModule, MatTableModule],
  templateUrl: './order.component.html',
  styles: [
    `
      .status-pending {
        --mdc-chip-elevated-container-color: #fff3e0;
        color: #e65100;
      }
      .status-shipped {
        --mdc-chip-elevated-container-color: #e8f5e9;
        color: #2e7d32;
      }
      .status-other {
        --mdc-chip-elevated-container-color: #eeeeee;
        color: #616161;
      }
      .totals p {
        margin: 4px 0;
      }
    `,
  ],
})
export class OrderComponent implements OnInit, OnChanges {
  @Input() orderId = 1;

  order: any;
  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;
  displayedColumns = ['productName', 'quantity', 'unitPrice'];

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.fetchOrder();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['orderId'] && !changes['orderId'].firstChange) {
      this.fetchOrder();
    }
  }

  fetchOrder() {
    this.orderService.getOrder(this.orderId).subscribe((data: any) => {
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
