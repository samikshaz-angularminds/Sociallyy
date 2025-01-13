import { CanActivateChildFn } from '@angular/router';
import { tokenConstant } from '../../constants/token';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const login_token = localStorage.getItem(tokenConstant.LOGIN_TOKEN)


  if(login_token) return true

  else return false;
};
