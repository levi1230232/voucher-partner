import { Component, effect, Input, OnInit, signal, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { PromotionService } from '../../services/promotion.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-vouchers-stats',
  standalone: true,
  imports: [MatCardModule, TranslateModule, MatIconModule, MatDatepickerModule, MatFormFieldModule],
  templateUrl: './vouchers-stats.html',
  styleUrl: './vouchers-stats.css',
})
export class VouchersStats implements OnInit {
  supportedLangs: string[] = ['en', 'vi'];
  currentLang: string = 'en';

  @Input() promotionId: string = '';

  selectedFilter = signal<string>('today');
  dateRange = signal<{
    start: Date | null;
    end: Date | null;
  }>({
    start: new Date(),
    end: new Date(),
  });

  stats = signal<any>({});

  constructor(
    private translate: TranslateService,
    private promotionService: PromotionService,
  ) {
    effect(() => {
      const range = this.dateRange();

      if (range.start && range.end) {
        this.callStats(range.start, range.end);
      }
    });
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.currentLang = savedLang;

    this.translate.setFallbackLang('en');
    this.translate.use(savedLang);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
  }
  filterLastDays(days: number, selectedFilter: string) {
    if (!days) {
      this.selectedFilter.set('');
    }
    this.selectedFilter.set(selectedFilter);
    const end = new Date();
    const start = new Date();
    if (days != 0) {
      start.setDate(end.getDate() - days);
    }

    this.dateRange.set({ start, end });
  }
  callStats(from: Date, to: Date) {
    const fromDate = this.formatDate(from);
    const toDate = this.formatDate(to);

    this.promotionService
      .statPromotion(this.promotionId, fromDate, toDate)
      .subscribe((res: any) => {
        const data = {
          ...res.data,
          percent: Math.floor((res.data.used_count / res.data.published_count) * 100),
        };

        this.stats.set(data);
      });
  }
  onStartDateChange(event: any) {
    this.dateRange.update((range) => ({
      ...range,
      start: event.value,
    }));
  }

  onEndDateChange(event: any) {
    this.selectedFilter.set('');
    this.dateRange.update((range) => ({
      ...range,
      end: event.value,
    }));
  }

  calcOffset(percent: number) {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;

    if (!percent || percent <= 0) {
      return circumference;
    }

    if (percent >= 100) {
      return 0;
    }

    return circumference - (percent / 100) * circumference;
  }
}
