import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  return token ? next(req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  })) : next(req);
};
