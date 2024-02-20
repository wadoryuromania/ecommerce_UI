import { inject } from '@angular/core';
import { CanActivateFn,Router,ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';
import { map } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';





export const authGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  return accountService.currentUser$.pipe(
    map(auth => {
      if (auth) return true;
      else {
        router.navigate(['/account/login'], {queryParams: {returnUrl: state.url}});//checout
        //console.log(router.url);//basket
        return false;
      }
    })
  );

};
