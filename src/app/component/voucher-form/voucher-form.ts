import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MtxNativeDatetimeModule } from '@ng-matero/extensions/core';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-voucher-form',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MtxDatetimepickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MtxNativeDatetimeModule,
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './voucher-form.html',
  styleUrls: ['./voucher-form.css'],
})
export class VoucherForm implements OnInit {
  voucherForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VoucherForm>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
  ) {
    this.voucherForm = this.fb.group({
      promotion_id: [{ value: data.promotion_id, disabled: true }],
      email: ['', [Validators.required, Validators.email]],
      number_voucher: ['', [Validators.required]],
      start_time: [null],
      end_time: [null],
    });
  }
  ngOnInit(): void {}
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

    const now = new Date();
    now.setMinutes(now.getMinutes() - 2);
    return date >= now;
  };

  disableEndDates = (date: Date | null): boolean => {
    if (!date) return false;

    const startDate = this.voucherForm.get('start_time')?.value;

    const start = new Date(startDate);
    start.setMinutes(start.getMinutes() - 1);

    return date >= start;
  };
  onlyNumber(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  formatNumber(event: any, field: string) {
    let value = event.target.value.replace(/,/g, '');
    if (value === '') return;

    let numValue = Number(value);
    if (isNaN(numValue)) return;

    const formatted = numValue.toLocaleString('en-US');
    this.voucherForm.get(field)?.setValue(formatted, { emitEvent: false });
  }

  submit() {
    this.submitted = true;
    if (this.voucherForm.invalid) return;

    const formData = this.voucherForm.value;

    const newVoucher = {
      promotion_id: this.data.promotion_id,
      ...formData,
      number_voucher: Number(String(formData.number_voucher).replace(/,/g, '')),
      start_time: this.formatDate(formData.start_time),
      end_time: this.formatDate(formData.end_time),
    };
    // console.log(newVoucher);

    this.dialogRef.close(newVoucher);
  }

  close() {
    this.dialogRef.close();
  }
}
