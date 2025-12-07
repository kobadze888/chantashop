import createMiddleware from 'next-intl/middleware';
import {routing} from './navigation';
 
export default createMiddleware(routing);
 
export const config = {
  // ყველა გვერდზე შემოწმება
  matcher: ['/', '/(ka|en|ru)/:path*']
};