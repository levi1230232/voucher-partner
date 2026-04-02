import { Component, effect, OnInit, signal, ViewChild } from '@angular/core';
import { Filter } from '../../component/filter/filter';
import { Header } from '../../component/header/header';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';

import { receiptFilter, ReceiptService } from '../../services/receipt.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-receipts',
  imports: [
    Filter,
    Header,
    TranslateModule,
    MatCardModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
    MatProgressSpinnerModule,
  ],
  templateUrl: './receipts.html',
  styleUrl: './receipts.css',
})
export class Receipts implements OnInit {
  displayedColumns: string[] = [
    '#',
    'receipt_code',
    'created_time',
    'payment_time',
    'total_amount',
    'status',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isLoading = signal<boolean>(false);
  dataSource = signal<[]>([]);
  filter = signal({
    status: '',
    page: 1,
    size: 20,
    receipt_code: '',
  });
  receiptsData = signal<any>({});
  statusList: string[] = ['ALL', 'UNPAID', 'PAID'];
  data = {
    fields: [
      {
        key: 'receipt_code',
        label: 'VOUCHER-CODE',
        type: 'text',
        placeholder: 'Ex: REC-123',
      },
      {
        key: 'created_time',
        label: 'CREATED-TIME',
        type: 'date-range',
      },
      {
        key: 'status',
        label: 'STATUS',
        type: 'select',
        options: this.statusList,
      },
    ],
    filter: { ...this.filter() },
  };
  constructor(
    private translate: TranslateService,
    private receiptService: ReceiptService,
  ) {
    effect(() => {
      const params = this.buildParams(this.filter());
      this.fetchVoucher(params);
    });
  }
  ngOnInit(): void {}
  buildParams(filter: receiptFilter): receiptFilter {
    return {
      page: filter.page,
      size: filter.size,
      ...(filter.status && { status: filter.status }),
      ...(filter.created_time_from && {
        created_time_from: this.formatDate(new Date(filter.created_time_from), 'start'),
      }),
      ...(filter.created_time_to && {
        created_time_to: this.formatDate(new Date(filter.created_time_to), 'end'),
      }),
      ...(filter.receipt_code !== undefined && { receipt_code: Number(filter.receipt_code) }),
    };
  }
  formatDate(date: Date, type: 'start' | 'end') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const time = type === 'start' ? '00:00:00' : '23:59:59';
    return `${year}-${month}-${day}+${time}`;
  }
  fetchVoucher(params: receiptFilter) {
    this.isLoading.set(true);
    this.receiptService.getReceipt(params).subscribe((res: any) => {
      this.isLoading.set(false);
      this.receiptsData.set(res.data);
      // console.log(params);
      this.dataSource.set(res.data.receipts);
    });
  }
  handleFilter(filterValue: any) {
    this.filter.update((f) => ({
      ...f,
      ...filterValue,
      page: 1,
    }));
  }
  pageChange(event: PageEvent) {
    this.filter.update((f) => ({
      ...f,
      page: event.pageIndex + 1,
      size: event.pageSize,
    }));
  }
}
