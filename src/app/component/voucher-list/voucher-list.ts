import { Component, effect, OnInit, signal, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Filter } from '../filter/filter';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { VoucherService } from '../../services/voucher.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CardDetail } from '../card-detail/card-detail';
import { MatIconModule } from '@angular/material/icon';
import { VoucherForm } from '../voucher-form/voucher-form';

import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Header } from '../header/header';
import { VouchersStats } from '../vouchers-stats/vouchers-stats';

@Component({
  selector: 'app-voucher-list',
  imports: [
    MatCardModule,
    Filter,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    CommonModule,
    CardDetail,
    MatIconModule,
    TranslateModule,
    MatProgressSpinnerModule,
    Header,
    VouchersStats,
  ],
  templateUrl: './voucher-list.html',
  styleUrl: './voucher-list.css',
})
export class VoucherList implements OnInit {
  total = signal<number>(0);
  promotionId: string = '';
  displayedColumns: string[] = [
    'stt',
    'voucher_code',
    'created_time',
    'end_time',
    'used_time',
    'status',
    'action',
  ];
  dataSource = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  filter = signal({
    voucher_code: '',
    status: '',
    page: 1,
    size: 20,
    created_time_from: null as Date | null,
    created_time_to: null as Date | null,
    use_time_from: null as Date | null,
    use_time_to: null as Date | null,
  });
  statusList = ['ALL', 'ACTIVE', 'INACTIVE', 'USED', 'LOCK', 'PENDING', 'EXPIRED'];
  data = {
    fields: [
      {
        key: 'voucher_code',
        label: 'VOUCHER-CODE',
        type: 'text',
        placeholder: 'EX: MPNGK3NLDK',
      },
      {
        key: 'status',
        label: 'STATUS',
        type: 'select',
        options: this.statusList,
      },
      {
        key: 'created_time',
        label: 'CREATED-TIME-RANGE',
        type: 'date-range',
      },
      {
        key: 'use_time',
        label: 'USE-TIME-RANGE',
        type: 'date-range',
      },
    ],
    filter: { ...this.filter() },
  };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private voucherService: VoucherService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {
    this.promotionId = this.route.snapshot.paramMap.get('promotionId')!;
    effect(() => {
      const params = this.buildParams(this.filter());
      this.fetchVoucher(params);
    });
  }
  ngOnInit(): void {
    const savedFilter = localStorage.getItem('voucherFilter');
    if (savedFilter) {
      const parsed = JSON.parse(savedFilter);
      this.filter.set({
        ...this.filter(),
        ...parsed,
        created_time_from: parsed.created_time_from ? new Date(parsed.created_time_from) : null,
        created_time_to: parsed.created_time_to ? new Date(parsed.created_time_to) : null,
        use_time_from: parsed.use_time_from ? new Date(parsed.use_time_from) : null,
        use_time_to: parsed.use_time_to ? new Date(parsed.use_time_to) : null,
      });
    }
  }
  saveFilter() {
    localStorage.setItem('voucherFilter', JSON.stringify(this.filter()));
  }
  formatDate(date: Date | null) {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  fetchVoucher(params: any) {
    this.isLoading.set(true);
    this.voucherService.getVouchers(params).subscribe((res: any) => {
      this.dataSource.set(res.data.vouchers || []);
      this.isLoading.set(false);
      // console.log(this.dataSource());
      this.total.set(res.data.totalElement || 0);
    });
  }
  handleFilter(filterValue: any) {
    this.filter.update((f) => ({
      ...f,
      ...filterValue,
      page: 1,
    }));
    // console.log(this.filter());
    this.saveFilter();
  }
  buildParams(filter: any) {
    const params: any = {
      page: filter.page,
      size: filter.size,
      promotion_id: this.promotionId,
    };
    if (filter.voucher_code) params.voucher_code = filter.voucher_code;
    if (filter.status) params.status = filter.status;

    if (filter.created_time_from)
      params.created_time_from = this.formatDate(filter.created_time_from);

    if (filter.created_time_to) params.created_time_to = this.formatDate(filter.created_time_to);

    if (filter.use_time_from) params.use_time_from = this.formatDate(filter.use_time_from);

    if (filter.use_time_to) params.use_time_to = this.formatDate(filter.use_time_to);

    return params;
  }
  pageChange(event: PageEvent) {
    this.filter.update((f) => ({
      ...f,
      page: event.pageIndex + 1,
      size: event.pageSize,
    }));

    this.saveFilter();
  }
  getVoucherStatus(voucher: any) {
    const now = new Date();
    if (voucher.sale_id && voucher.voucher_status == 'ACTIVE') return 'LOCKED';
    if (new Date(voucher.start_time) > now) return 'PENDING';
    if (new Date(voucher.end_time) < now) return 'EXPIRED';
    return voucher.voucher_status;
  }
  openUnlockDialog(voucher: any) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '500px',
      data: {
        name: voucher.voucher_code,
        title: 'Are you sure you want to unlock voucher',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      // console.log(result);
      this.voucherService.unlockVoucher(voucher.voucher_code).subscribe({
        next: (res: any) => {
          if (res?.error?.message) {
            // console.log(res);
            this.toastr.error(res.error.message.split('TrackId')[0].trim());
          } else {
            this.toastr.success('Unlock voucher successfully', 'Success');
          }
          this.filter.update((f) => ({ ...f }));
        },
        error: (err) => {
          const message = err?.error?.message || 'Error unlock voucher';
          this.toastr.error(message, 'Error');
          // console.log(err);
        },
      });
    });
  }
  openDialog(promotionId: string) {
    const dialogRef = this.dialog.open(VoucherForm, {
      width: '600px',

      data: {
        promotion_id: promotionId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.voucherService.addVoucher(result).subscribe({
        next: (res: any) => {
          if (res?.error?.message) {
            this.toastr.error(res.error.message.split('TrackId')[0].trim());
          } else {
            this.toastr.success('Created successfully', 'Success');
          }
          // console.log(res);
          this.filter.update((f) => ({ ...f }));
        },
        error: (err) => {
          const message = err?.error?.message || 'Error create voucher';
          this.toastr.error(message, 'Error');
          // console.log(err);
        },
      });
    });
  }
}
