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
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { MtxNativeDatetimeModule } from '@ng-matero/extensions/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Header } from '../header/header';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-promotion-form',
  imports: [
    MatIconModule,
    MatCardModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MtxDatetimepickerModule,
    MtxNativeDatetimeModule,
    RouterLink,
    TranslateModule,
    Header,
  ],
  templateUrl: './promotion-form.html',
  styleUrl: './promotion-form.css',
})
export class PromotionForm implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() promotionData: any;
  @Output() submitForm = new EventEmitter<any>();
  promotionForm!: FormGroup;
  submitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.promotionData) {
      this.patchData(this.promotionData);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['promotionData'] && this.promotionForm) {
      this.patchData(changes['promotionData'].currentValue);
    }
  }
  private patchData(data: any) {
    if (!data) return;

    this.promotionForm.patchValue({
      name: data.name,
      description: data.description,
      apply_brands: data.apply_brands || [],
      discount_type: data.discount_type,
      discount_scope: data.discount_scope,
      discount_value: data.discount_value ? (data.discount_value * 100).toLocaleString('en-US') : 0,
      is_coupon: data.is_coupon ?? 0,
      discount_max: data.discount_max ? data.discount_max.toLocaleString('en-US') : 0,
      min_order_value: data.min_order_value ? data.min_order_value.toLocaleString('en-US') : 0,
      start_time: data.start_time ? new Date(data.start_time) : null,
      end_time: data.end_time ? new Date(data.end_time) : null,
    });
  }

  private initForm() {
    this.promotionForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      apply_brands: [[], [Validators.required]],
      discount_type: ['PERCENTAGE'],
      discount_scope: ['ORDER'],
      discount_value: [null, [Validators.required, Validators.min(0)]],
      is_coupon: [1],
      discount_max: [0, [Validators.min(0)]],
      min_order_value: [0, [Validators.min(0)]],
      start_time: [null, [Validators.required]],
      end_time: [null, [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.promotionForm.invalid) {
      return;
    }
    if (this.promotionForm.valid) {
      const formData = this.promotionForm.value;

      const preparedData = {
        ...formData,
        discount_value: Number(String(formData.discount_value || '0').replace(/,/g, '')) / 100,
        discount_max: Number(String(formData.discount_max || '0').replace(/,/g, '')),
        min_order_value: Number(String(formData.min_order_value || '0').replace(/,/g, '')),
        start_time: this.formatDate(formData.start_time),
        end_time: this.formatDate(formData.end_time),
      };

      const updatedPromotion = {
        ...this.promotionData,
        ...preparedData,
        created_time: this.formatDate(new Date()),
      };

      this.submitForm.emit(updatedPromotion);

      // console.log(updatedPromotion);
    }
  }
  resetForm() {
    this.promotionForm.reset();
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
  disablePastDates = (date: Date | null): boolean => {
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentStart = this.promotionForm?.get('start_time')?.value;

    if (currentStart && new Date(currentStart).getTime() === date.getTime()) {
      return true;
    }

    return date >= today;
  };
  disableEndDates = (date: Date | null): boolean => {
    if (!date) return false;

    const startDate = this.promotionForm?.get('start_time')?.value;
    const currentEnd = this.promotionForm?.get('end_time')?.value;

    const minDate = startDate ? new Date(startDate) : new Date();

    minDate.setHours(0, 0, 0, 0);

    if (currentEnd && new Date(currentEnd).getTime() === date.getTime()) {
      return true;
    }

    return date >= minDate;
  };
  formatNumber(event: any, field: string) {
    let value = event.target.value.replace(/,/g, '');
    if (value === '') return;

    let numValue = Number(value);
    if (isNaN(numValue)) return;

    const discountType = this.promotionForm.get('discount_type')?.value;

    if (field === 'discount_value' && discountType === 'PERCENTAGE') {
      if (numValue > 100) {
        numValue = 100;
      }
    }

    const formatted = numValue.toLocaleString('en-US');
    this.promotionForm.get(field)?.setValue(formatted, { emitEvent: false });
  }
  onlyNumber(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  brands = [
    { value: 'FOOKBOOK', label: 'Fookbook' },
    { value: 'BRAND-11K4', label: 'Steak Restaurant' },
    { value: 'BRAND-59T1', label: 'iPOS Uneti Coffee & Drink' },
    { value: 'BRAND-OMY7', label: 'Laville' },
    { value: 'BRAND-QUTK', label: 'Bánh Canh Ghẹ' },
    { value: 'SPOLHCM4', label: 'SPOLHCM4' },
  ];
  getSelectedBrandNames(): string[] {
    const selected = this.promotionForm.get('apply_brands')?.value || [];

    return this.brands.filter((b) => selected.includes(b.value)).map((b) => b.label);
  }
}
