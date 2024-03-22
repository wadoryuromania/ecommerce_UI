import { Component, OnInit } from '@angular/core';
import { Order } from '../shared/models/order';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders: Order[] = [];

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
     this.getOrders();
  }

  // getOrders() {
  //   this.ordersService.getOrdersForUser().subscribe((orders: Order[]) => {
  //     this.orders = orders;
  //   }, error => {
  //     console.log(error);
  //   });
  //}

  getOrders() {
    this.ordersService.getOrdersForUser().subscribe({
      next: orders =>this.orders = orders,
      error: error => {
      console.log(error)
    }});
}
}
