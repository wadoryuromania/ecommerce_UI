
// //de analizat git tutorial

// import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         const token = localStorage.getItem('token');

//         if (token) {
//             req = req.clone({
//                 setHeaders: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//         }
//         return next.handle(req);
//     }
// }//merge


/////////////////////
import { Injectable } from '@angular/core';

import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';

import { Observable, take } from 'rxjs';

import { AccountService } from 'src/app/account/account.service';





@Injectable() export class JwtInterceptor implements HttpInterceptor {

token?: string;

constructor(private accountService: AccountService) {}

intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>

{

     this.accountService.currentUser$.pipe(take(1)).subscribe({

          next: user => this.token = user?.token

     })

     if (this.token) {

          request = request.clone({

              setHeaders: { Authorization: `Bearer ${this.token}`

          }

      })

     }

     return next.handle(request);

  }

}
