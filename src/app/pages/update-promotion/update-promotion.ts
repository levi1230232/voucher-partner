import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionService } from '../../services/promotion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromotionForm } from '../../component/promotion-form/promotion-form';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-promotion',
  standalone: true,
  imports: [CommonModule, FormsModule, PromotionForm],
  templateUrl: './update-promotion.html',
  styleUrls: ['./update-promotion.css'],
})
export class UpdatePromotion implements OnInit {
  promotionData = signal<any>(null);
  loading = signal<boolean>(true);
  promotionId!: string;
  title = 'UPDATE-PROMOTION';

  constructor(
    private route: ActivatedRoute,
    private promotionService: PromotionService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.promotionId = this.route.snapshot.paramMap.get('promotionId')!;
    if (this.promotionId) {
      this.loadPromotion(this.promotionId);
    }
  }

  loadPromotion(promotionId: string) {
    this.loading.set(true);
    this.promotionService.getPromotionById(promotionId).subscribe({
      next: (res: any) => {
        const promotion = res.data?.promotions?.[0] || null;
        this.promotionData.set(promotion);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching promotion:', err);
        this.loading.set(false);
      },
    });
  }

  updatePromotion(formData: any) {
    this.promotionService.addPromotion(formData).subscribe({
      next: (res) => {
        this.router.navigate(['/promotions']);
        this.toastr.success('Updated successfully', 'Success');
      },
      error: () => {
        this.toastr.error('Error update promotion', 'Error');
      },
    });
  }
}
