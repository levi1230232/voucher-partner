import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { PromotionList } from './component/promotion-list/promotion-list';
import { CreatePromotion } from './pages/create-promotion/create-promotion';
import { UpdatePromotion } from './pages/update-promotion/update-promotion';
import { VoucherList } from './component/voucher-list/voucher-list';
import { authGuard } from './auth-guard';
import { UsageDashboard } from './pages/usage-dashboard/usage-dashboard';
import { Receipts } from './pages/receipts/receipts';
import { ReceiptDetail } from './pages/receipt-detail/receipt-detail';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      { path: 'promotions', component: PromotionList },
      { path: 'promotion/create', component: CreatePromotion },
      { path: 'promotion/:promotionId/edit', component: UpdatePromotion },
      { path: 'promotion/:promotionId/vouchers', component: VoucherList },
      { path: 'monthly-usage', component: UsageDashboard },
      { path: 'receipts', component: Receipts },
      { path: 'receipt/:receiptCode', component: ReceiptDetail },
    ],
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
