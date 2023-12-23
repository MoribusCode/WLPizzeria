import { ActivatedRoute, ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { UserPropertyService } from '../api/user-property/user-property.service';
import { Router } from '@angular/router';


export const roleGuard: CanActivateFn = (route : ActivatedRouteSnapshot, state : RouterStateSnapshot) => {
  const boolean : boolean = inject(UserPropertyService).getIsOwner()
  const isOwner = route.data['isOwner'];
  console.log(isOwner)
  if(boolean === isOwner){
    return true
  }else{
    console.log("permission denied")
    inject(Router).navigate(['/permission-denied'])
    return false
  }
};

export const roleChildGuard: CanActivateChildFn = (route : ActivatedRouteSnapshot, state : RouterStateSnapshot) => {
  const boolean : boolean = inject(UserPropertyService).getIsOwner()
  const isOwner = route.data['isOwner'];
  console.log(isOwner)
  if(boolean === isOwner){
    return true
  }else{
    console.log("permissiondenied")
    inject(Router).navigate(['/permission-denied'])
    return false
  }
};
