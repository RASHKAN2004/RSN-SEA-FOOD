'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

// Architecture placeholder: hook this up to a translation provider (e.g. next-intl)
// with /locales/en.json, /locales/si.json, /locales/ta.json when translations are ready.
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' },
];

export default function LanguageSelector() {
  const [active, setActive] = useState('en');

  return (
    <div className="flex items-center gap-1 text-xs text-sea-100">
      <Globe size={14} />
      {LANGUAGES.map((lang, i) => (
        <span key={lang.code} className="flex items-center">
          <button
            onClick={() => setActive(lang.code)}
            className={active === lang.code ? 'font-semibold text-white' : 'hover:text-white'}
          >
            {lang.label}
          </button>
          {i < LANGUAGES.length - 1 && <span className="mx-1 text-sea-400">|</span>}
        </span>
      ))}
    </div>
  );
}
