import createMiddleware from 'next-intl/middleware';
import {routing} from './navigation';
 
export default createMiddleware(routing);
 
export const config = {
  // განახლებული matcher, რათა დაიჭიროს პრეფიქსის გარეშე გვერდებიც
  matcher: [
    // 1. გამოტოვოს ყველა შიდა სისტემური ფაილი (_next, api, static files, images)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // 2. დაიჭიროს ყველა დანარჩენი
    '/'
  ]
};