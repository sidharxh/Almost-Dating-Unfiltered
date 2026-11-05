import {pageMetadata} from '@/lib/seo';
export const metadata = {
  ...pageMetadata('Dating Simulator Waitlist', 'Join the Almost dating simulator waitlist with your Google account.', '/waitlist'),
  robots: {index:false, follow:true},
};
export default function Layout({children}:{children:React.ReactNode}) { return children; }
