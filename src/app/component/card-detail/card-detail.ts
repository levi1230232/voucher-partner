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
  supportedLanguage: string[] = ['en', 'vi'];
  currentLang: string = 'en';
  menuOpen = false;
  constructor(private translate: TranslateService) {}
  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.currentLang = savedLang;

    this.translate.setFallbackLang('en');
    this.translate.use(savedLang);
  }
}
