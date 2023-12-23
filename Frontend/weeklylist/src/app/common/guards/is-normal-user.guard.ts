import { CanActivateFn } from '@angular/router';
import { UserPropertyService } from '../api/user-property/user-property.service';
import { inject } from '@angular/core';

export const isNormalUserGuard: CanActivateFn = (route, state) => {
  const bool : boolean = inject(UserPropertyService).getIsOwner()
  console.log(bool)
  return bool;
};
