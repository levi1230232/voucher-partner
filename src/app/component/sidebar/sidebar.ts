import { Component, Input, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatSidenavModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    TranslateModule,
    MatButtonToggleModule,
    MatButtonModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  @Input() collapsed = false;

  supportedLangs: string[] = ['en', 'vi'];

  currentLang = signal('en');

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    const savedLanguage = localStorage.getItem('lang') || 'en';

    this.currentLang.set(savedLanguage);

    this.translate.setFallbackLang('en');
    this.translate.use(savedLanguage);
  }

  changeLanguage(lang: string) {
    this.currentLang.set(lang);

    this.translate.use(lang).subscribe(() => {
      localStorage.setItem('lang', lang);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
