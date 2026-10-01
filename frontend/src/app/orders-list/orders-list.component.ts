import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-orders-list',
  imports: [CommonModule, MatTableModule, MatChipsModule, MatCardModule],
  templateUrl: './orders-list.component.html',
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
      tr.order-row {
        cursor: pointer;
      }
    `,
  ],
})
export class OrdersListComponent implements OnInit {
  @Output() orderSelected = new EventEmitter<number>();

  orders: any[] = [];
  displayedColumns = ['id', 'customerName', 'status', 'total'];

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.orderService.getOrders().subscribe((data: any) => {
      console.log('orders list', data);
      this.orders = data;
      this.cdr.detectChanges();
    });
  }

  getStatusClass(status: string) {
    return status === 'PENDING'
      ? 'status-pending'
      : status === 'SHIPPED'
        ? 'status-shipped'
        : 'status-other';
  }

  selectOrder(order: any) {
    this.orderSelected.emit(order.id);
  }
}
