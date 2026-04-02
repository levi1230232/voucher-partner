import { Component, computed, effect, OnInit, signal, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Filter } from '../filter/filter';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PromotionService } from '../../services/promotion.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { RouterModule } from '@angular/router';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Header } from '../header/header';

@Component({
  selector: 'app-promotion-list',
  imports: [
    TranslateModule,
    MatCardModule,
    Filter,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterModule,
    MatProgressSpinnerModule,
    Header,
  ],
  templateUrl: './promotion-list.html',
  styleUrl: './promotion-list.css',
})
export class PromotionList implements OnInit {
  displayedColumns = [
    'promotion_id',
    'name',
    'brand',
    'discount_details',
    'time',
    'status',
    'action',
  ];

  statusList = ['ALL', 'ACTIVE', 'COMPLETED', 'PENDING', 'CANCELLED'];
  discountTypeList = ['ALL', 'AMOUNT', 'PERCENTAGE'];

  dataSource = signal<any[]>([]);
  total = signal<number>(0);
  isLoading = signal(false);

  filter = signal({
    promotion_id: '',
    page: 1,
    size: 20,
    status_list: '',
    name: '',
    discount_type: '',
    created_time_from: null as Date | null,
    created_time_to: null as Date | null,
    end_time_from: null as Date | null,
    end_time_to: null as Date | null,
    start_time_from: null as Date | null,
    start_time_to: null as Date | null,
  });
  filterCount = computed(() => {
    const skipKeys = ['page', 'size'];

    return Object.entries(this.filter()).filter(
      ([key, value]) => !skipKeys.includes(key) && value !== '' && value !== null,
    ).length;
  });
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private promotionService: PromotionService,
    private translate: TranslateService,
    private dialog: MatDialog,
  ) {
    effect(() => {
      const params = this.buildParams(this.filter());
      this.fetchPromotions(params);
    });
  }
  data = {
    fields: [
      {
        key: 'promotion_id',
        label: 'PROMOTION-ID',
        type: 'text',
        placeholder: 'PROMOTION-ID-PLACEHOLDER',
      },
      {
        key: 'name',
        label: 'NAME',
        type: 'text',
        placeholder: 'PROMOTION-NAME-PLACEHOLDER',
      },
      { key: 'status_list', label: 'STATUS', type: 'select', options: this.statusList },
      {
        key: 'discount_type',
        label: 'DISCOUNT-TYPE',
        type: 'select',
        options: this.discountTypeList,
      },
      { key: 'created_time', label: 'CREATED-TIME', type: 'date-range' },
      { key: 'start_time', label: 'START-TIME', type: 'date-range' },
      { key: 'end_time', label: 'END-TIME', type: 'date-range' },
    ],
    filter: { ...this.filter() },
  };
  ngOnInit() {
    const savedFilter = localStorage.getItem('promotionsFilter');

    if (savedFilter) {
      const parsed = JSON.parse(savedFilter);

      this.filter.set({
        ...this.filter(),
        ...parsed,
        created_time_from: parsed.created_time_from ? new Date(parsed.created_time_from) : null,
        created_time_to: parsed.created_time_to ? new Date(parsed.created_time_to) : null,
        end_time_from: parsed.end_time_from ? new Date(parsed.end_time_from) : null,
        end_time_to: parsed.end_time_to ? new Date(parsed.end_time_to) : null,
        start_time_from: parsed.start_time_from ? new Date(parsed.start_time_from) : null,
        start_time_to: parsed.start_time_to ? new Date(parsed.start_time_to) : null,
      });
    }
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

  buildParams(filter: any) {
    const params: any = {
      page: filter.page,
      size: filter.size,
    };

    if (filter.promotion_id) params.promotion_id = filter.promotion_id;
    if (filter.status_list) params.status_list = filter.status_list;
    if (filter.name) params.name = filter.name;
    if (filter.discount_type) params.discount_type = filter.discount_type;

    if (filter.created_time_from)
      params.created_time_from = this.formatDate(filter.created_time_from);

    if (filter.created_time_to) params.created_time_to = this.formatDate(filter.created_time_to);

    if (filter.end_time_from) params.end_time_from = this.formatDate(filter.end_time_from);

    if (filter.end_time_to) params.end_time_to = this.formatDate(filter.end_time_to);

    if (filter.start_time_from) params.start_time_from = this.formatDate(filter.start_time_from);

    if (filter.start_time_to) params.start_time_to = this.formatDate(filter.start_time_to);

    return params;
  }

  fetchPromotions(params: any) {
    this.isLoading.set(true);
    this.promotionService.getPromotions(params).subscribe((res: any) => {
      this.isLoading.set(false);
      this.dataSource.set(res.data.promotions || []);
      this.total.set(res.data.totalElement || 0);
    });
  }

  saveFilter() {
    localStorage.setItem('promotionsFilter', JSON.stringify(this.filter()));
  }
  handleFilter(filterValue: any) {
    this.filter.update((f) => ({
      ...f,
      ...filterValue,
      page: 1,
    }));

    this.saveFilter();
  }
  pageChange(event: PageEvent) {
    this.filter.update((f) => ({
      ...f,
      page: event.pageIndex + 1,
      size: event.pageSize,
    }));

    this.saveFilter();
  }
  openDialogConfirmActive(promotion: any) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '500px',
      data: {
        title:
          promotion.status === 'CANCELLED'
            ? `Are you sure you want to active the promotion`
            : `Are you sure you want to cancel the promotion`,
        name: promotion.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.isLoading.set(true);
      const newStatus = promotion.status === 'CANCELLED' ? 'ACTIVE' : 'CANCELLED';

      const payload = {
        ...promotion,
        status: newStatus,
      };

      this.promotionService.addPromotion(payload).subscribe({
        next: () => {
          this.isLoading.set(false);
          const params = this.buildParams(this.filter());
          this.fetchPromotions(params);
        },
        error: (err) => {
          console.error('Update promotion failed', err);
        },
      });
    });
  }
}
