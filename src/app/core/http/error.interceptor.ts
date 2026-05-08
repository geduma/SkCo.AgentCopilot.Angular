import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        error.status === 0
          ? 'No fue posible conectar con el servidor.'
          : `Error ${error.status}: ${error.statusText || 'desconocido'}`;
      console.error('[HTTP]', message, error);
      return throwError(() => ({ status: error.status, message, original: error }));
    }),
  );
};
