import './globals.css';
import {LanguageProvider} from '@/components/LanguageProvider';
import Header from '@/components/Header';
export const metadata={title:'99 MALL | Online Shopping',description:'Shop everything at 99 MALL'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><LanguageProvider><Header/>{children}<footer>© {new Date().getFullYear()} 99 MALL · Shop smart, shop easy.</footer></LanguageProvider></body></html>}
