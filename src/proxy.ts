import createMiddleware from 'next-intl/middleware';
import {routing} from './navigation';
 
export default createMiddleware(routing);
 
export const config = {
  //Matcher: გამოტოვებს სისტემურ ფაილებს და API-ს
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/']
};