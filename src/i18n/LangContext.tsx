import React, { createContext, useContext, useState } from 'react'
import { STRINGS, DATA_KM, type LangCode, type StringKey } from './strings'

interface LangState {
  lang: LangCode
  setLang: (l: LangCode) => void
}

const LangContext = createContext<LangState>({ lang: 'km', setLang: () => {} })

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    try { return (localStorage.getItem('nh_lang') as LangCode) ?? 'km' } catch { return 'km' }
  })

  const setLang = (l: LangCode) => {
    setLangState(l)
    try { localStorage.setItem('nh_lang', l) } catch {}
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export function useLang() { return useContext(LangContext) }

export function useT() {
  const { lang } = useLang()
  return (key: StringKey): string => {
    const s = STRINGS[lang]
    return (s?.[key] ?? STRINGS.en[key] ?? key) as string
  }
}

// Translates English data/content strings (product names, feature lists, FAQ)
// for display. Unknown strings pass through unchanged.
export function useTd() {
  const { lang } = useLang()
  return (text: string): string => (lang === 'km' ? (DATA_KM[text] ?? text) : text)
}
