import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);
  hide = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
  ) {}
  toggleVisibility() {
    this.hide = !this.hide;
  }
  login() {
    if (!this.username() || !this.password()) {
      this.errorMessage.set('Vui lòng nhập username và password');
      return;
    }
    this.errorMessage.set('');
    this.isLoading.set(true);
    this.authService.login(this.username(), this.password()).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        if (res?.error) {
          const rawMessage = res.error.message || 'Tài khoản hoặc mật khẩu không đúng';
          this.errorMessage.set(rawMessage.split('TrackId')[0].trim());
          // console.log(res);
          return;
        }
        if (res?.data?.token) {
          this.authService.saveToken(res.data.token);
          this.router.navigate(['/promotions']);
        } else {
          this.errorMessage.set('Không có phản hồi từ serve');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorBody = err?.error;
        if (errorBody?.error?.message) {
          this.errorMessage.set(errorBody.error.message.split('TrackId')[0].trim());
        } else {
          this.errorMessage.set('Không thể kết nối tới serve');
        }
      },
    });
  }
}
