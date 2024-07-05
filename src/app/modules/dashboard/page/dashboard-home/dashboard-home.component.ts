import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy{
  public productLists: Array<GetAllProductsResponse> = [];
  private destroy$ = new Subject<void>();

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private productsDataTransferService: ProductsDataTransferService,
  ) { }

  ngOnInit(): void {
    this.getProductDatas();
  }

  getProductDatas(): void {
    this.productsService
      .getAllProducts()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
            if (response.length > 0) {
              this.productLists = response;
              this.productsDataTransferService.setProductsData(this.productLists);
            }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Erro ao buscar produtos',
            life: 2500
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
