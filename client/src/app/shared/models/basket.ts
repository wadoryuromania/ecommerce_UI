import * as cuid from "cuid";

export interface BasketItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  pictureUrl: string;
  brand: string;
  type: string;
}


export interface IBasket {
  id: string;
  items: BasketItem[];
}


export class Basket implements IBasket {
  id = cuid();
  items: BasketItem[] = [];
}

export interface BasketTotals{
shipping:number;
subtotal:number;
total:number;
}
