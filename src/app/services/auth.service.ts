import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  login(username: string, password: string) {
    const body = new HttpParams().set('user_name', username).set('password', password).toString();

    console.log(username, password);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http.post('/ipos/ws/multi-brand-promotion/login', body, { headers }).pipe(
      catchError((error) => {
        console.log('Login API error', error);
        return throwError(() => error);
      }),
    );
  }
  saveToken(token: string) {
    localStorage.setItem('tool_token', token);
  }
  logout() {
    localStorage.removeItem('tool_token');
    localStorage.removeItem('promotionsFilter');
    localStorage.removeItem('voucherFilter');
  }
}
