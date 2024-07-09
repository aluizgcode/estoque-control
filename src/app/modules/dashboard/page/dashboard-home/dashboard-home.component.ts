import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
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
  private destroy$ = new Subject<void>();
  public producstList: Array<GetAllProductsResponse> = [];

  public productsChartDatas!: ChartData;
  public productsChartoptions!: ChartOptions;

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
              this.producstList = response;
              this.productsDataTransferService.setProductsData(this.producstList);
              this.setProductsChartConfig();
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

  setProductsChartConfig(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.productsChartDatas = {
      labels: this.producstList.map((element) => element?.name),
      datasets: [{
        label: ' Quantidade',
        backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
        borderColor: documentStyle.getPropertyValue('--indigo-400'),
        hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
        data: this.producstList.map((element) => element?.amount),
      }]
    };

    this.productsChartoptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.0,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
