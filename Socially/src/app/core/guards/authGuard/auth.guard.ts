import { CanActivateChildFn, Router } from '@angular/router';
import { tokenConstant } from '../../constants/token';
import { inject } from '@angular/core';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const login_token = localStorage.getItem(tokenConstant.LOGIN_TOKEN)
  const router = inject(Router)

  if (login_token) {
    // console.log("YES FROM AUTH: ", login_token);

    return true
  }

  else {
router.navigateByUrl('/account/login')
    return false
  };
};
