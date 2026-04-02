import { Component, OnInit, signal } from '@angular/core';
import { Header } from '../../component/header/header';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { ReceiptService } from '../../services/receipt.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-receipt-detail',
  imports: [Header, TranslateModule, MatCardModule, DatePipe, MatIconModule, CommonModule],
  templateUrl: './receipt-detail.html',
  styleUrl: './receipt-detail.css',
})
export class ReceiptDetail implements OnInit {
  receiptCode: string = '';

  invoice = signal<any>([]);
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private receiptService: ReceiptService,
  ) {
    this.receiptCode = this.route.snapshot.paramMap.get('receiptCode') || '';
    this.fetchReceiptDetail();
  }
  ngOnInit(): void {}
  fetchReceiptDetail() {
    this.receiptService.getReceiptByCode(Number(this.receiptCode)).subscribe((res: any) => {
      this.invoice.set(res.data.receipts[0]);
      // console.log(this.invoice);
    });
  }
  printPage() {
    const printContent = document.getElementById('print-section');

    if (!printContent) return;

    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;

    window.print();

    document.body.innerHTML = originalContent;

    window.location.reload();
  }
}
