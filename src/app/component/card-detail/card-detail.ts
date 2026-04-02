import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-card-detail',
  imports: [MatMenuModule, MatIconModule, TranslateModule],
  templateUrl: './card-detail.html',
  styleUrl: './card-detail.css',
})
export class CardDetail implements OnInit {
  @Input() voucherDetail: any = {};

  menuOpen = false;
  constructor(private translate: TranslateService) {}
  ngOnInit(): void {}
}
