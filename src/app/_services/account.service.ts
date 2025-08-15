// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { map, finalize } from 'rxjs/operators';

// import { environment } from '@environments/environment';
// import { Account } from '@app/_models';
// import { ActivityLog , ActivityLogsResponse } from '@app/_models/activity-log.model'; // Ensure this model exists

// const baseUrl = `${environment.apiUrl}/accounts`;

// @Injectable({ providedIn: 'root' })
// export class AccountService {
//     private accountSubject: BehaviorSubject<Account | null>;
//     public account: Observable<Account | null>;

//     constructor(
//         private router: Router,
//         private http: HttpClient
//     ) {
//         this.accountSubject = new BehaviorSubject<Account | null>(null);
//         this.account = this.accountSubject.asObservable();
//     }

//     public get accountValue() {
//         return this.accountSubject.value;
//     }

//     login(email: string, password: string) {
//         return this.http.post<any>(`${baseUrl}/authenticate`, { email, password }, { withCredentials: true })
//             .pipe(map(account => {
//                 this.accountSubject.next(account);
//                 this.startRefreshTokenTimer();
//                 return account;
//             }));
//     }

//     logout() {
//         this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
//         this.stopRefreshTokenTimer();
//         this.accountSubject.next(null);
//         this.router.navigate(['/account/login']);
//     }

//     refreshToken() {
//         return this.http.post<any>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
//             .pipe(map((account) => {
//                 this.accountSubject.next(account);
//                 this.startRefreshTokenTimer();
//                 return account;
//             }));
//     }

//     register(account: Account) {
//         return this.http.post(`${baseUrl}/register`, account);
//     }

//     verifyEmail(token: string) {
//         return this.http.post(`${baseUrl}/verify-email`, { token });
//     }

//     forgotPassword(email: string) {
//         return this.http.post(`${baseUrl}/forgot-password`, { email });
//     }

//     validateResetToken(token: string) {
//         return this.http.post(`${baseUrl}/validate-reset-token`, { token });
//     }

//     resetPassword(token: string, password: string, confirmPassword: string) {
//         return this.http.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
//     }
     
//      // Get all accounts (for dropdown in branch assignment)
//      getAllAccounts(): Observable<Account[]> {
//         return this.http.get<Account[]>(baseUrl);
//     }

//     getAll() {
//         return this.http.get<Account[]>(baseUrl);
//     }
    
//     getById(id: string) {
//         return this.http.get<Account>(`${baseUrl}/${id}`);
//     }

//     create(params: any) {
//         return this.http.post(baseUrl, params);
//     }

//     getAllActivityLogs(): Observable<ActivityLog[]> {
//         return this.http.get<ActivityLogsResponse>(`${baseUrl}/activity-logs`).pipe(
//             map(response => {
//                 if (Array.isArray(response)) {
//                     return response as ActivityLog[];
//                 }
//                 return response.data || [];
//             })
//         );
//     }
    
//     getActivityLogs(accountId: string, filters: any = {}): Observable<any[]> {
//         return this.http.post<any[]>(`${baseUrl}/${accountId}/activity`, filters);
//     }

//     update(id: string, params: any) {
//         return this.http.put(`${baseUrl}/${id}`, params)
//             .pipe(map((account: any) => {
//                 // update the current account if it was updated
//                 if (account.id === this.accountValue?.accountId) {
//                     // publish updated account to subscribers
//                     account = { ...this.accountValue, ...account };
//                     this.accountSubject.next(account);
//                 }
//                 return account;
//             }));
//     }

//     delete(id: string) {
//         return this.http.delete(`${baseUrl}/${id}`)
//             .pipe(finalize(() => {
//                 // auto logout if the logged in account was deleted
//                 if (id === this.accountValue?.accountId)
//                     this.logout();
//             }));
//     }

//     // helper methods

//     private refreshTokenTimeout?: any;

//     private startRefreshTokenTimer() {
//         // parse json object from base64 encoded jwt token
//         const jwtBase64 = this.accountValue!.jwtToken!.split('.')[1];
//         const jwtToken = JSON.parse(atob(jwtBase64));

//         // set a timeout to refresh the token a minute before it expires
//         const expires = new Date(jwtToken.exp * 1000);
//         const timeout = expires.getTime() - Date.now() - (60 * 1000);
//         this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
//     }
//     // private startRefreshTokenTimer() {
//     //     // ensure we actually have an account and token
//     //     const jwtToken = this.accountValue?.jwtToken;
//     //     if (!jwtToken || typeof jwtToken !== 'string') {
//     //       // nothing to do — avoid calling split on undefined
//     //       console.warn('startRefreshTokenTimer: no jwtToken available, timer not started', this.accountValue);
//     //       return;
//     //     }
      
//     //     // parse json object from base64 encoded jwt token
//     //     const parts = jwtToken.split('.');
//     //     if (!parts || parts.length < 2) {
//     //       console.warn('startRefreshTokenTimer: jwtToken does not look like a JWT', jwtToken);
//     //       return;
//     //     }
      
//     //     try {
//     //       const jwtBase64 = parts[1];
//     //       const jwtTokenJson = JSON.parse(atob(jwtBase64));
      
//     //       // set a timeout to refresh the token a minute before it expires
//     //       const expires = new Date(jwtTokenJson.exp * 1000);
//     //       const timeout = expires.getTime() - Date.now() - (60 * 1000);
//     //       if (timeout <= 0) {
//     //         // token already expired or near-expiry — attempt immediate refresh
//     //         this.refreshToken().subscribe();
//     //       } else {
//     //         this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
//     //       }
//     //     } catch (err) {
//     //       console.error('startRefreshTokenTimer: failed parsing jwt token', err);
//     //     }
//     //  }

//     private stopRefreshTokenTimer() {
//         clearTimeout(this.refreshTokenTimeout);
//     }
// }


import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Account } from '@app/_models';

const baseUrl = `${environment.apiUrl}/accounts`;

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account | null>;
    public account: Observable<Account | null>;

    // constructor(
    //     private router: Router,
    //     private http: HttpClient
    // ) {
    //     this.accountSubject = new BehaviorSubject<Account | null>(null);
    //     this.account = this.accountSubject.asObservable();
    // }
    constructor(private http: HttpClient, private router: Router) {
        const saved = localStorage.getItem('account');
        this.accountSubject = new BehaviorSubject<Account | null>(saved ? JSON.parse(saved) : null);
        this.account = this.accountSubject.asObservable();
      }

    public get accountValue() {
        return this.accountSubject.value;
    }

    // login(email: string, password: string) {
    //     return this.http.post<any>(`${baseUrl}/authenticate`, { email, password }, { withCredentials: true })
    //         .pipe(map(account => {
    //             this.accountSubject.next(account);
    //             this.startRefreshTokenTimer();
    //             return account;
    //         }));
    // }

    // logout() {
    //     this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
    //     this.stopRefreshTokenTimer();
    //     this.accountSubject.next(null);
    //     this.router.navigate(['/account/login']);
    // }

    // refreshToken() {
    //     return this.http.post<any>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
    //         .pipe(map((account) => {
    //             this.accountSubject.next(account);
    //             this.startRefreshTokenTimer();
    //             return account;
    //         }));
    // }

    login(email: string, password: string) {
        return this.http.post<any>(`${baseUrl}/authenticate`, { email, password }, { withCredentials: true })
          .pipe(map(account => {
            // backend now returns full account object including jwtToken
            localStorage.setItem('account', JSON.stringify(account));
            this.accountSubject.next(account);
            this.startRefreshTokenTimer();
            return account;
          }));
      }

      logout() {
        // call revoke endpoint (sends httpOnly refresh cookie), no body required
        this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true })
          .pipe(finalize(() => {
            // client-side cleanup
            this.stopRefreshTokenTimer?.();
            localStorage.removeItem('account');
            this.accountSubject.next(null);
            this.router.navigate(['/account/login']);
          }))
          .subscribe({
            // swallow errors but you can log or show alert if you want
            next: () => {},
            error: () => {}
          });
      }

      refreshToken() {
        return this.http.post<any>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
          .pipe(map((account) => {
            localStorage.setItem('account', JSON.stringify(account));
            this.accountSubject.next(account);
            this.startRefreshTokenTimer();
            return account;
          }));
      }

    register(account: Account) {
        return this.http.post(`${baseUrl}/register`, account);
    }

    verifyEmail(token: string) {
        return this.http.post(`${baseUrl}/verify-email`, { token });
    }

    forgotPassword(email: string) {
        return this.http.post(`${baseUrl}/forgot-password`, { email });
    }

    validateResetToken(token: string) {
        return this.http.post(`${baseUrl}/validate-reset-token`, { token });
    }

    resetPassword(token: string, password: string, confirmPassword: string) {
        return this.http.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
    }

    getAll() {
        return this.http.get<Account[]>(baseUrl);
    }

    getById(accountId: string) {
        return this.http.get<Account>(`${baseUrl}/${accountId}`);
    }

    create(params: any) {
        return this.http.post(baseUrl, params);
    }

    update(accountId: string, params: any) {
        return this.http.put(`${baseUrl}/${accountId}`, params)
            .pipe(map((account: any) => {
                // update the current account if it was updated
                if (account.accountId === this.accountValue?.accountId) {
                    // publish updated account to subscribers
                    account = { ...this.accountValue, ...account };
                    this.accountSubject.next(account);
                }
                return account;
            }));
    }

    delete(accountId: string) {
        return this.http.delete(`${baseUrl}/${accountId}`)
            .pipe(finalize(() => {
                // auto logout if the logged in account was deleted
                if (accountId === this.accountValue?.accountId)
                    this.logout();
            }));
    }

    // helper methods

    private refreshTokenTimeout?: any;

    // private startRefreshTokenTimer() {
    //     // parse json object from base64 encoded jwt token
    //     const jwtBase64 = this.accountValue!.jwtToken!.split('.')[1];
    //     const jwtToken = JSON.parse(atob(jwtBase64));

    //     // set a timeout to refresh the token a minute before it expires
    //     const expires = new Date(jwtToken.exp * 1000);
    //     const timeout = expires.getTime() - Date.now() - (60 * 1000);
    //     this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    // }
    private startRefreshTokenTimer() {
        // ensure we actually have an account and token
        const jwtToken = this.accountValue?.jwtToken;
        if (!jwtToken || typeof jwtToken !== 'string') {
          // nothing to do — avoid calling split on undefined
          console.warn('startRefreshTokenTimer: no jwtToken available, timer not started', this.accountValue);
          return;
        }
      
        // parse json object from base64 encoded jwt token
        const parts = jwtToken.split('.');
        if (!parts || parts.length < 2) {
          console.warn('startRefreshTokenTimer: jwtToken does not look like a JWT', jwtToken);
          return;
        }
      
        try {
          const jwtBase64 = parts[1];
          const jwtTokenJson = JSON.parse(atob(jwtBase64));
      
          // set a timeout to refresh the token a minute before it expires
          const expires = new Date(jwtTokenJson.exp * 1000);
          const timeout = expires.getTime() - Date.now() - (60 * 1000);
          if (timeout <= 0) {
            // token already expired or near-expiry — attempt immediate refresh
            this.refreshToken().subscribe();
          } else {
            this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
          }
        } catch (err) {
          console.error('startRefreshTokenTimer: failed parsing jwt token', err);
        }
     }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}