import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrderComponent } from './order/order.component';

@Component({
  imports: [RouterOutlet, OrderComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
