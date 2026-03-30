import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
export interface PromotionRequest {
  name: string;
  description: string;
  apply_brands: string[];
  discount_type: string;
  discount_scope: string;
  discount_value: number;
  discount_max: number;
  min_order_value: number;
  start_time: string;
  end_time: string;
}
@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  constructor(private http: HttpClient) {}
  addPromotion(promotion: PromotionRequest) {
    return this.http.post('/ipos/ws/multi-brand-promotion/upsert', promotion);
  }
  getPromotions(filter: any) {
    let params = new HttpParams()
      .set('size', filter.size.toString())
      .set('page', filter.page.toString());
    if (filter.promotion_id) params = params.set('promotion_id', filter.promotion_id);
    if (filter.name) params = params.set('name', filter.name);
    if (filter.status_list) params = params.set('status_list', filter.status_list);
    if (filter.discount_type) params = params.set('discount_type', filter.discount_type);
    if (filter.created_time_from)
      params = params.set('created_time_from', filter.created_time_from);
    if (filter.created_time_to) params = params.set('created_time_to', filter.created_time_to);
    if (filter.start_time_from) params = params.set('start_time_from', filter.start_time_from);
    if (filter.start_time_to) params = params.set('start_time_to', filter.start_time_to);
    if (filter.end_time_from) params = params.set('end_time_from', filter.end_time_from);
    if (filter.end_time_to) params = params.set('end_time_to', filter.end_time_to);
    return this.http.get('/ipos/ws/multi-brand-promotion/filter', { params });
  }
  getPromotionById(promotion_id: string) {
    return this.http.get(
      `/ipos/ws/multi-brand-promotion/filter?promotion_id=${promotion_id}&page=1&size=20`,
    );
  }
  statPromotion(promotionId: string, from: string, to: string) {
    const params = new HttpParams()
      .set('promotion_id', promotionId)
      .set('from', from)
      .set('to', to);

    return this.http.get(`/ipos/ws/multi-brand-promotion/stats`, { params });
  }
  getStatsMonthlyUsage(dateStart: string, dateEnd: string) {
    const params = new HttpParams().set('date_start', dateStart).set('date_end', dateEnd);
    return this.http.get('/ipos/ws/multi-brand-promotion/monthly-usage', { params });
  }
}
