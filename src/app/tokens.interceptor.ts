import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/observable';
import { EMPTY } from 'rxjs/internal/observable/empty';

import { TokensService } from './tokens.service';
import { throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokensInterceptor implements HttpInterceptor {

  tokensService: TokensService;

  constructor(
    private injector: Injector
   ) { }

  /**
   * Intercepts the requests made by the HttpClient, in order to add a transparent authentication mechanism.
   *  - Try to add the auth token.
   *  - If no auth token is found, we try to generate one (with another request) and then forward the original request.
   *  - As a last resort (no auth, no refresh), we send a dummy response.
   *
   * If the response to any request (except the auth one...) is a 401, we also try to generate an auth token and
   * forward the original request
   *
   * TODO :
   * - Handle parallel requests (do only one auth call, all other requests arriving before the auth response should
   *     "register" to this same call
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Manual injection needed here...
    if (this.tokensService === undefined) {
      this.tokensService = this.injector.get(TokensService);
    }
    // Let the auth request pass through the interceptor (it's normal if this one does not have an auth token)
    if (request.url.indexOf('api/auth/token') !== -1) {
      return next.handle(request);
    }

    // Add the auth header (request it if needed)
    const requestObservable$ = this.addAuthHeaderAndProcessRequest(request, next);

    // If the request returns a 401, get a new auth token and retry it
    return requestObservable$.pipe(catchError(err => {
      if (err.status === 401) {
          this.tokensService.authToken = undefined;
          return this.authenticateAndForwardRequest(request, next);
      }
      return throwError(err);
    }));

  }

  private addAuthHeaderAndProcessRequest(request, next): Observable<HttpEvent<any>> {
    // Case 1 : We have an auth token : let's roll !
    if (this.tokensService.authToken !== undefined) {
      request = request.clone(this.tokensService.getAuthTokenHeader());
      return next.handle(request);
    }

    // Case 2 : Use the refresh token (try to find one if we don't already have one) to retrieve an auth token
    // Once the auth token is retrieved, forward the current request
    if (this.tokensService.refreshToken === undefined) {
      this.tokensService.loadRefreshToken();
    }
    if (this.tokensService.refreshToken !== undefined) {
      return this.authenticateAndForwardRequest(request, next);
    }

    // Case 3 : Unable to find a refresh token : return a dummy response
    return this.dummyResponse();
  }

  private authenticateAndForwardRequest(request, next): Observable<HttpEvent<any>> {
    return this.tokensService.updateAuthToken().pipe(
        switchMap(json => {
          if (json.success === 'yes') {
            return next.handle(request.clone(this.tokensService.getAuthTokenHeader()));
          }
          return this.dummyResponse();
        })
    );
  }

  private dummyResponse(): Observable<HttpEvent<any>> {
    return EMPTY;
  }
}
