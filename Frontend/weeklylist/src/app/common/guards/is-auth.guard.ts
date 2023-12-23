import { CanActivateFn, CanActivateChildFn } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { UserPropertyService } from '../api/user-property/user-property.service';

export const isAuthGuard: CanActivateChildFn = (route, state) => {
  const bool : boolean = inject(UserPropertyService).isLogged()
  if(bool){
    console.log("prova")
    if(inject(UserPropertyService).getIsOwner()){
      inject(Router).navigate(['/admin-dashboard'])
    }else{
      inject(Router).navigate(['/user-dashboard'])
    }
    return false
  }else{
    console.log("non è loggato")

    return true
  }
};
