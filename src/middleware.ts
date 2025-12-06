// ფაილის გზა: src/middleware.ts

import createMiddleware from 'next-intl/middleware';
import {routing} from './navigation';
 
export default createMiddleware(routing);
 
export const config = {
  matcher: ['/', '/(ka|en|ru)/:path*']
};