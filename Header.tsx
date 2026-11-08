'use client';
import Link from 'next/link';
import {useLanguage} from './LanguageProvider';
export default function Header(){const {lang,toggle}=useLanguage();return <header className="top"><Link className="brand" href="/">99<span>MALL</span></Link><nav><Link href="/">{lang==='hi'?'होम':'Home'}</Link><Link href="/cart">{lang==='hi'?'कार्ट':'Cart'}</Link><Link href="/account">{lang==='hi'?'मेरा खाता':'Account'}</Link><Link href="/admin">Admin</Link><button className="lang" onClick={toggle}>{lang==='hi'?'English':'हिंदी'}</button></nav></header>}
