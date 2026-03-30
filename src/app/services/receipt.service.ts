import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface receiptFilter {
  status?: string;
  created_time_from?: string;
  created_time_to?: string;
  page: number;
  size: number;
  receipt_code?: number | string;
}
@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  constructor(private http: HttpClient) {}
  getReceipt(filter: receiptFilter) {
    let query = `size=${filter.size}&page=${filter.page}`;

    if (filter.created_time_from) query += `&date_start=${filter.created_time_from}`;

    if (filter.created_time_to) query += `&date_end=${filter.created_time_to}`;

    if (filter.status) query += `&status=${filter.status}`;

    if (filter.receipt_code) query += `&receipt_code=${filter.receipt_code}`;

    return this.http.get(`/ipos/ws//multi-brand-promotion/receipts?${query}`);
  }
  getReceiptByCode(receipt_code: number) {
    return this.http.get(`/ipos/ws//multi-brand-promotion/receipts?receipt_code=${receipt_code}`);
  }
}
