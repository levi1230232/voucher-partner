import { Component, ViewChild, OnInit } from '@angular/core';
import { PromotionForm } from '../../component/promotion-form/promotion-form';
import { PromotionService } from '../../services/promotion.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-promotion',
  standalone: true,
  imports: [PromotionForm],

  templateUrl: './create-promotion.html',
  styleUrl: './create-promotion.css',
})
export class CreatePromotion implements OnInit {
  title = 'CREATE-NEW-PROMOTION';

  @ViewChild(PromotionForm) promotionForm!: PromotionForm;

  constructor(
    private promotionService: PromotionService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit() {}

  createPromotion(data: any) {
    this.promotionService.addPromotion(data).subscribe({
      next: (res) => {
        this.router.navigate(['/promotions']);

        this.toastr.success('Created successfully', 'Success');
        // this.promotionForm.resetForm();
      },
      error: () => {
        this.toastr.error('Error create promotion', 'Error');
      },
    });
  }
}
