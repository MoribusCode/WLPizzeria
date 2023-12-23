import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import { JwtService } from '../jwt/jwt.service';
import { environment } from 'src/environments/enviroment';

interface TokenData {
  id : string,
  isOwner: boolean,
  email: string,
  firstName : string,
  lastName: string
};

@Injectable({
  providedIn: 'root'
})
export class UserPropertyService {

  constructor(private jwts : JwtService) { }

  getIsOwner(){
    const token : string = this.jwts.getToken();

    const tokenData = (jwt_decode(token) as TokenData)
    if(token === null){
      throw new Error("User not authenticated")
    }
    return tokenData.isOwner
  }

  getId(){
    const token : string = this.jwts.getToken();

    const tokenData = (jwt_decode(token) as TokenData)
    if(token === null){
      throw new Error("User not authenticated")
    }
    return tokenData.id
  }

  getEmail(){
    const token : string = this.jwts.getToken();

    const tokenData = (jwt_decode(token) as TokenData)
    if(token === null){
      throw new Error("User not authenticated")
    }
    return tokenData.email.toString()
  }

  isTokenExpired(): boolean {
    const token: string = this.jwts.getToken();

    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        const expirationDate: number = decodedToken.exp * 1000; // Converti il timestamp UNIX in millisecondi
        const currentTimestamp: number = Date.now();

        return currentTimestamp > expirationDate;
      } catch (error) {
        // Gestisci eventuali errori durante la decodifica del token
        console.error('Errore durante la decodifica del token:', error);
        return true; // Considera il token scaduto in caso di errori
      }
    }

    return true; // Nessun token presente o token vuoto (consideralo scaduto)
  }



  getFirstName(){
    const token : string = this.jwts.getToken();

    const tokenData = (jwt_decode(token) as TokenData)
    if(token === null){
      throw new Error("User not authenticated")
    }
    return tokenData.firstName
  }
  getLasttName(){
    const token : string = this.jwts.getToken();

    const tokenData = (jwt_decode(token) as TokenData)
    if(token === null){
      throw new Error("User not authenticated")
    }
    return tokenData.lastName
  }

  isLogged() : boolean {
    const rule : string | null = localStorage.getItem(environment.localStorageTokenKey);
    if(rule === null){
      return false
    }else{
      return true
    }
  }

  logout() : void {
    console.log("removing")
    localStorage.removeItem(environment.localStorageTokenKey);
    console.log("removed")
  }

}
