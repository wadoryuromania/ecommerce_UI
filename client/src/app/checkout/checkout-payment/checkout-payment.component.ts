import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { Basket } from 'src/app/shared/models/basket';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent {
  @Input() checkoutForm?: FormGroup;

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router:Router
  ) {}

  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();

    if (!basket) return;

    const orderToCreate = this.getOrderToCreate(basket);
    if(!orderToCreate) return;
    this.checkoutService.createOrder(orderToCreate).subscribe({
      next: order => {
        this.toastr.success('Order created succesfully');
        this.basketService.deleteLocalBasket();
       // console.log(order);
       const navigationExtras: NavigationExtras = {state: order};
       this.router.navigate(['checkout/success'],navigationExtras);
      }
    })
    // try {
    //   const createdOrder = await this.createOrder(basket);
    //   const paymentResult = await this.confirmPaymentWithStripe(basket);

    //   if (paymentResult.paymentIntent) {
    //     this.basketService.deleteBasket(basket);
    //     const navigationExtras: NavigationExtras = {state: createdOrder};
    //     this.router.navigate(['checkout/success'], navigationExtras);
    //   } else {
    //     this.toastr.error(paymentResult.error.message);
    //   }
    //   this.loading = false;
    // } catch (error) {
    //   console.log(error);
    //   this.loading = false;
    // }
  }

  getOrderToCreate(basket: Basket) {
    const deliveryMethodId = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    const shipToAddress = this.checkoutForm?.get('addressForm')?.value;

    if (!deliveryMethodId || !shipToAddress) return;
    return {
      basketId: basket.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress
    }
  }
}
