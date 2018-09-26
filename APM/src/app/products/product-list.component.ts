import {Component, OnInit} from "@angular/core";
import {IProduct} from "./product";
import {ProductService} from "./product.service";
// import {ConvertToSpacesPipe} from "../shared/convert-to-spaces.pipe";

@Component({
  selector: 'pm-products',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [ProductService,]
})

export class ProductListComponent implements OnInit {
  pageTitle: string = 'Product List';
  imageWidth: number = 50;
  imageMargin: number = 2;
  showImage: boolean = false;
  products: IProduct[] = [];
  errorMessage: string;

  _listFilter: string;
  filteredProducts: IProduct[];

  constructor(private productService: ProductService) {}

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string){
    this._listFilter = value;
    this.filteredProducts = this._listFilter ? this.performFilter(this.listFilter) : this.products;
  }

  performFilter(filterBy:string): IProduct[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product : IProduct) =>
      product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }
  ngOnInit(): void{
    this.productService.getProducts().subscribe(
      products => {
        this.products = products;
        this.filteredProducts = this.products;
      },
      error => this.errorMessage = <any>error

    );
  }

  onRatingClicked(message:string): void{
    this.pageTitle = 'Product List: ' + message;
  }
}
