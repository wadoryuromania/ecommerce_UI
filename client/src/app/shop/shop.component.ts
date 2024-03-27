import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../shared/models/product';
import { ShopService } from './shop.service';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  @ViewChild('search') searchTerm?: ElementRef;
  products: Product[] = [];
  brands: Brand[] = [];
  types: Type[] = [];

  // brandIdSelected = 0;
  // typeIdSelected = 0;
  // sortSelected = 'name';
  // shopParams = new ShopParams();
  shopParams: ShopParams;

  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  totalCount = 0;

  constructor(private shopService: ShopService) {
    this.shopParams = shopService.getShopParams(); //initialize proprety inside the constructor
  }
  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    this.shopService.getProducts(/*this.shopParams*/).subscribe({
      next: (response) => {
        this.products = response.data;
        // this.shopParams.pageNumber = response.pageIndex;
        // this.shopParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: (error) => console.log(error),
    });
  }

  getBrands() {
    this.shopService.getBrands().subscribe({
      next: (response) => (this.brands = [{ id: 0, name: 'All' }, ...response]),
      error: (error) => console.log(error),
    });
  }

  getTypes() {
    this.shopService.getTypes().subscribe({
      next: (response) => (this.types = [{ id: 0, name: 'All' }, ...response]),
      error: (error) => console.log(error),
    });
  }

  onBrandSelected(brandId: number) {
    const params = this.shopService.getShopParams();
    // this.shopParams.brandId = brandId;
    // this.shopParams.pageNumber = 1;
    params.brandId = brandId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    const params = this.shopService.getShopParams();
    // this.shopParams.typeId = typeId;
    // this.shopParams.pageNumber = 1;
    params.typeId = typeId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  onSortSelected(event: any) {
    const params = this.shopService.getShopParams();
    //this.shopParams.sort = event.target.value;
    params.sort = event.target.value;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  // onPageChanged(event:any){
  //   if(this.shopParams.pageNumber !== event.page){
  //     this.shopParams.pageNumber = event.page;
  //     this.getProducts();
  //   }
  // }
  onPageChanged(event: any) {
    const params = this.shopService.getShopParams();
    // if (this.shopParams.pageNumber !== event) {
    //   this.shopParams.pageNumber = event;
    //   this.getProducts();
    // }
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.shopParams = params;
      this.getProducts();
    }
  }

  onSearch() {
    const params = this.shopService.getShopParams();
    // this.shopParams.search = this.searchTerm?.nativeElement.value;
    // this.shopParams.pageNumber = 1;
    params.search = this.searchTerm?.nativeElement.value;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  onReset() {
    if (this.searchTerm) this.searchTerm.nativeElement.value = '';
    //this.shopParams = new ShopParams();
    const params = new ShopParams();
    this.shopService.setShopParams(params);
    this.shopParams = params;//?
    this.getProducts();
  }
}
