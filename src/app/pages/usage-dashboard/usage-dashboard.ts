import { Component, effect, OnInit, signal, ViewChild } from '@angular/core';
import { Header } from '../../component/header/header';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexTheme,
  ApexTitleSubtitle,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { PromotionService } from '../../services/promotion.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  theme: ApexTheme;
  yaxis: ApexYAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-usage-dashboard',
  imports: [
    Header,
    TranslateModule,
    MatCardModule,
    NgApexchartsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
  ],
  templateUrl: './usage-dashboard.html',
  styleUrl: './usage-dashboard.css',
})
export class UsageDashboard implements OnInit {
  displayedColumns: string[] = ['Date', 'Issued Quantity'];
  @ViewChild('chart') chart?: ChartComponent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public chartOptions: ChartOptions;

  supportedLangs: string[] = ['en', 'vi'];
  currentLang: string = 'en';
  total = signal<number>(0);
  dataSource = new MatTableDataSource<any>([]);
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
    this.chartOptions = {
      series: [
        {
          name: this.translate.instant('QUANTITY'),
          data: [],
        },
      ],
      chart: {
        type: 'area',
        height: 350,
        animations: { enabled: true, speed: 300 },
        zoom: { enabled: false },
      },
      xaxis: {
        type: 'datetime',
      },
      stroke: {
        curve: 'smooth',
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 4,
      },
      fill: {
        opacity: 0.5,
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy',
        },
      },
      title: {
        text: 'VOUCHER-ISSUANCE-CHART',
      },
      theme: {
        palette: 'palette1',
      },
      yaxis: { forceNiceScale: true },
    };

    effect(
      () => {
        const range = this.dateRange();

        if (range.start && range.end) {
          setTimeout(() => {
            this.callStats(range.start!, range.end!);
          }, 200);
        }
      },
      { allowSignalWrites: true },
    );

    effect(() => {
      const stats = this.stats();

      if (!stats?.list_rp_daily_billing || !this.chart) return;

      const chartData = stats.list_rp_daily_billing.map((item: any) => {
        const year = Number(item.date_hash.slice(0, 4));
        const month = Number(item.date_hash.slice(4, 6)) - 1;
        const day = Number(item.date_hash.slice(6, 8));

        return {
          x: new Date(year, month, day).getTime(),
          y: Number(item.voucher_published) || 0,
        };
      });

      const minX = chartData[0]?.x;
      const maxX = chartData[chartData.length - 1]?.x;

      this.chart.updateOptions({
        series: [
          {
            name: this.translate.instant('QUANTITY'),
            data: chartData,
          },
        ],
        xaxis: {
          type: 'datetime',
          min: minX,
          max: maxX,
        },
      });
    });
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'en';

    this.currentLang = savedLang;
    this.translate.setFallbackLang('en');
    this.translate.use(savedLang);
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

  formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
  }

  formatDate(date: string) {
    return `${date.slice(6, 8)}/${date.slice(4, 6)}/${date.slice(0, 4)}`;
  }
  pageChange(event: PageEvent) {}
  callStats(from: Date, to: Date) {
    const fromDate = this.formatDateInput(from);
    const toDate = this.formatDateInput(to);

    this.promotionService.getStatsMonthlyUsage(fromDate, toDate).subscribe((res: any) => {
      const list = res.data.list_rp_daily_billing || [];

      const total_issued = list.reduce(
        (acc: number, current: any) => acc + (current.voucher_published || 0),
        0,
      );

      const len_data = list.length || 0;

      const daily_average = (total_issued / list.length || 0).toFixed(1);

      const peak_data =
        len_data > 0
          ? list.reduce((prev: any, current: any) =>
              (prev.voucher_published || 0) > (current.voucher_published || 0) ? prev : current,
            )
          : null;

      const low_data =
        len_data > 0
          ? list.reduce((prev: any, current: any) =>
              (prev.voucher_published || 0) < (current.voucher_published || 0) ? prev : current,
            )
          : null;

      const data = {
        ...res.data,
        total_issued,
        daily_average,
        peak_day: peak_data?.date_hash,
        peak_value: peak_data?.voucher_published || 0,
        low_value: low_data?.voucher_published || 0,
        low_date: low_data?.date_hash,
        len_data: len_data,
      };

      this.total.set(len_data);

      this.stats.set(data);

      this.dataSource.data = list;

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });
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
}
