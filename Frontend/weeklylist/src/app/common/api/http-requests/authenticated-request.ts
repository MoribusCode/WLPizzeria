
import { BaseRequest, RequestOptions} from "./base-request";
import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { JwtService } from "../jwt/jwt.service";
import { UserPropertyService } from "../user-property/user-property.service";
import { Router } from "@angular/router";


export abstract class AuthenticatedRequest extends BaseRequest{
  protected readonly jwtService: JwtService;
  protected readonly ups: UserPropertyService;

  protected constructor(httpClient: HttpClient, jwtService: JwtService, ups:UserPropertyService, private router: Router) {
    super(httpClient);

    this.jwtService = jwtService;
    this.ups = ups
}


protected override create_options(params?: HttpParamsOptions): RequestOptions  {
  const reqOptions: RequestOptions = super.create_options(params);

  if(this.ups.isTokenExpired()){
    this.ups.logout()
    const currentUrl = this.router.url;
    this.router.navigate(['/authentication/login'], {
      queryParams: {
        sessionExpired: 'true',
        redirectUrl: encodeURIComponent(currentUrl) // Codifica l'URL corrente
      }
    });

  }
  const accessToken: string = this.jwtService.getToken()
  const headersWithAuth: HttpHeaders = reqOptions.headers.set(
      'Authorization',`Bearer ${accessToken}`
  );

  return {
      headers: headersWithAuth,
      params: reqOptions.params,
  };
}
}
