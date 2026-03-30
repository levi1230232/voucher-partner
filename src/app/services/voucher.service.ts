import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VoucherService {
  constructor(private http: HttpClient) {}

  getVouchers(filter: any) {
    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('size', filter.size.toString());

    if (filter.status) {
      params = params.set('status', filter.status);
    }

    if (filter.promotion_id) {
      params = params.set('promotion_id', filter.promotion_id);
    }

    if (filter.voucher_code) {
      params = params.set('voucher_code', filter.voucher_code);
    }
    if (filter.created_time_from) {
      params = params.set('created_time_from', filter.created_time_from);
    }

    if (filter.created_time_to) {
      params = params.set('created_time_to', filter.created_time_to);
    }

    if (filter.use_time_from) {
      params = params.set('use_time_from', filter.use_time_from);
    }

    if (filter.use_time_to) {
      params = params.set('use_time_to', filter.use_time_to);
    }

    return this.http.get('/ipos/ws/multi-brand-promotion/voucher/filter', { params });
  }
  addVoucher(newVoucher: any) {
    const body = new HttpParams()
      .set('promotion_id', String(newVoucher.promotion_id))
      .set('number_voucher', String(newVoucher.number_voucher).replace(/,/g, ''))
      .set('email', String(newVoucher.email))
      .set('start_time', newVoucher.start_time ? String(newVoucher.start_time) : '')
      .set('end_time', newVoucher.end_time ? String(newVoucher.end_time) : '');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post('/ipos/ws/multi-brand-promotion/voucher/export', body.toString(), {
      headers,
    });
  }
  unlockVoucher(voucherCode: string) {
    const body = new HttpParams().set('voucher_code', voucherCode);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http.post('ipos/ws/multi-brand-promotion/voucher/unlock', body.toString(), {
      headers,
    });
  }
}
