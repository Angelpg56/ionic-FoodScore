import { HttpInterceptorFn } from '@angular/common/http';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // Si la URL ya es absoluta, no la modifiques
  if (/^https?:\/\//i.test(req.url)) {
    return next(req);
  }
  const serverURL = 'https://api.fullstackpro.es/foodscore';
  return next(req.clone({ url: `${serverURL}/${req.url}` }));
};
