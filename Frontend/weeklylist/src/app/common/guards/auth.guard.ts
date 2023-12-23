import { CanActivateFn } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserPropertyService } from '../api/user-property/user-property.service';


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  console.log("prova");
  const bool: boolean = inject(UserPropertyService).isLogged();

  if (bool) {
    return bool;
  } else {
    // Passa i parametri nella navigazione alla pagina di login
    inject(Router).navigate(['/authentication/login'], {
      queryParams: {
        sessionExpired: 'false',
        redirectUrl: state.url // Utilizza l'URL corrente come redirectUrl
      }
    });
    return false; // Restituisci false per impedire la navigazione all'utente non autenticato
  }
};
