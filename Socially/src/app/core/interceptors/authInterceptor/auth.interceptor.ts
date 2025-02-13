import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';

const isRefreshing = { value:false };
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn =  (req, next) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log('request in auth interceptor.. ',req);
  
  return next(req).pipe(
        catchError((error:HttpErrorResponse) => {
      console.log("before error catching... ",error.status);
      
      if(error.status===401 || (error.status===500 && typeof error.error==='string' && error.error.includes('TokenExpiredError'))){
        console.log("hi from errrorrr");
        
        const result = handleTokenExpiration(req,next,authService,router);
        return result;
      }
      return throwError(()=>error);
    })
  )

};
const handleTokenExpiration =  (
  req:HttpRequest<unknown>, 
  next:HttpHandlerFn, 
  authService:AuthService, 
  router:Router) => {
    console.log("refreshing value.....",isRefreshing);
    
  if (!isRefreshing.value) {
    isRefreshing.value = true;
    refreshTokenSubject.next(null);

    return authService.refreshAccessToken().pipe(
      switchMap((newToken:any) => {

        console.log("new token..",newToken);
        
        isRefreshing.value = false;
        refreshTokenSubject.next(null);
        return next(req.clone({setHeaders :{Authorization: `Bearer ${newToken}`}}))
      }),
      catchError((err) => {
        isRefreshing.value = false;
        authService.logout();
        router.navigate(['account/login']);
        return throwError(() => err);
      })
    )
  }else{
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next(req.clone({setHeaders : {Authorization : `Bearer ${token}`}})))
    )
  }
}
