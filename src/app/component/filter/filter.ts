import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-filter',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    FormsModule,
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './filter.html',
  styleUrl: './filter.css',
})
export class Filter implements OnInit, OnChanges {
  supportedLanguage: string[] = ['en', 'vi'];
  currentLang: string = 'en';
  fields: any[] = [];
  filter: any = {};
  @Input() isLoading: boolean = false;
  @Input() data: any = {};
  @Output() applyFilter = new EventEmitter<any>();

  constructor(private translate: TranslateService) {}
  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.currentLang = savedLang;

    this.translate.setFallbackLang('en');
    this.translate.use(savedLang);
    this.setData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.setData();
    }
  }

  private setData(): void {
    if (this.data) {
      this.fields = this.data.fields || [];
      this.filter = { ...(this.data.filter || {}) };
    }
  }
  onFilter() {
    this.applyFilter.emit(this.filter);
    // console.log(this.filter);
  }
  onResetFilter() {
    const resetFilter: any = {
      page: 1,
      size: 20,
    };

    this.fields.forEach((field) => {
      if (field.type === 'date-range') {
        resetFilter[field.key + '_from'] = null;
        resetFilter[field.key + '_to'] = null;
      } else {
        resetFilter[field.key] = '';
      }
    });

    this.filter = resetFilter;

    localStorage.removeItem('promotionsFilter');

    this.applyFilter.emit(this.filter);
  }
}
