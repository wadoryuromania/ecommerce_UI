import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { Basket } from 'src/app/shared/models/basket';
import { NavigationExtras, Router } from '@angular/router';
import {
  Stripe,
  StripeCardCvcElement,
  StripeCardExpiryElement,
  StripeCardNumberElement,
  loadStripe,
} from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm?: FormGroup;
  @ViewChild('cardNumber') cardNumberElement?: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement?: ElementRef;
  @ViewChild('cardCvc') cardCvcElement?: ElementRef;

  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;
  cardErrors: any;
  //loading = false;

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    loadStripe(
      'pk_test_51Ox5qGRof2ztyhlDPiC16iRPr1yz1aXyb1DEnGAbCKJ3mfGynSS4oyWSBki8YKAbGNmoytS33aZgaDrhe9o8GMwc00gTGviYwO'
    ).then((stripe) => {
      this.stripe = stripe;
      const elements = stripe?.elements(); // () execute
      if (elements) {
        this.cardNumber = elements.create('cardNumber');
        this.cardNumber.mount(this.cardNumberElement?.nativeElement);
        this.cardNumber.on('change', (event) => {
          //cardNumber change event
          if (event.error) {
            this.cardErrors = event.error.message;
            console.log(this.cardErrors);
          } else {
            this.cardErrors = null;
          }
        });

        this.cardExpiry = elements.create('cardExpiry');
        this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);
        this.cardExpiry.on('change', (event) => {
          if (event.error) {
            this.cardErrors = event.error.message;
            console.log(this.cardErrors);
          } else {
            this.cardErrors = null;
          }
        });

        this.cardCvc = elements.create('cardCvc');
        this.cardCvc.mount(this.cardCvcElement?.nativeElement);
        this.cardCvc.on('change', (event) => {
          if (event.error) {
            this.cardErrors = event.error.message;
            console.log(this.cardErrors);
          } else {
            this.cardErrors = null;
          }
        });
      }
    });
  }

  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();

    if (!basket) return;

    const orderToCreate = this.getOrderToCreate(basket);
    if (!orderToCreate) return;
    this.checkoutService.createOrder(orderToCreate).subscribe({
      next: (order) => {
        this.toastr.success('Order created succesfully');
        this.stripe
          ?.confirmCardPayment(basket.clientSecret!, {
            //? optional chaining
            payment_method: {
              card: this.cardNumber!, //?
              billing_details: {
                name: this.checkoutForm?.get('paymentForm')?.get('nameOnCard')
                  ?.value,
              },
            },
          })
          .then((result) => {
            console.log(result);
            if (result.paymentIntent) {
              this.basketService.deleteLocalBasket();
              // console.log(order);
              const navigationExtras: NavigationExtras = { state: order };
              this.router.navigate(['checkout/success'], navigationExtras);
            } else {
              this.toastr.error(result.error.message);
            }
          });
      },
    });
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
    const deliveryMethodId = this.checkoutForm
      ?.get('deliveryForm')
      ?.get('deliveryMethod')?.value;
    const shipToAddress = this.checkoutForm?.get('addressForm')?.value;

    if (!deliveryMethodId || !shipToAddress) return;
    return {
      basketId: basket.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress,
    };
  }
}
