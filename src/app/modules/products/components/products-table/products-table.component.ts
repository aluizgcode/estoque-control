import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { DeleteProductAction } from 'src/app/models/interfaces/products/event/DeleteProductAction';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: []
})
export class ProductsTableComponent {
  @Input() products: Array<GetAllProductsResponse> = [];
  @Output() productEvent = new EventEmitter<EventAction>();
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>();

  public productSelected!: GetAllProductsResponse;
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;

  handleProductEvent(action: string, id?: string): void {
    if (action && action != '') {
      const productEventData = id && id != '' ? { action, id } : { action };

      // emitr o valor do evento para a classe pai. conceito de output
      this.productEvent.emit(productEventData);
    }
  }

  // o nome das variaveis passadas como parametro e o nome das variaveis da interface tem q ser iguais
  handleDelectProcust(product_id: string, product_name: string): void {
    if (product_id != '' && product_name != '') {
      this.deleteProductEvent.emit({
        product_id,
        product_name
      })
    }
  }
}
