import { HttpInterceptorFn } from '@angular/common/http';
import { tokenConstant } from '../../constants/token';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem(tokenConstant.LOGIN_TOKEN)

  if (token) {
    console.log('TOKEN IS: ',token);
    
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token
      }
    })
    return next(clonedReq)
  }
  
  return next(req);
};
