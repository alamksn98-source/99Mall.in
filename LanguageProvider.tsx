'use client';
import {createContext,useContext,useState} from 'react';
type Lang='en'|'hi';
const C=createContext<{lang:Lang;toggle:()=>void}>({lang:'en',toggle:()=>{}});
export function LanguageProvider({children}:{children:React.ReactNode}){const [lang,setLang]=useState<Lang>('en');return <C.Provider value={{lang,toggle:()=>setLang(x=>x==='en'?'hi':'en')}}>{children}</C.Provider>}
export const useLanguage=()=>useContext(C);
