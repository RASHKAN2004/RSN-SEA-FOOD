'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const translations = {
  en: {},
  ta: {
    Support: 'உதவி', FAQ: 'அடிக்கடி கேட்கப்படும் கேள்விகள்', 'Delivery Areas': 'விநியோகப் பகுதிகள்', 'Submit Your Inquiry': 'உங்கள் விசாரணையை அனுப்புங்கள்', 'Delivery Available': 'விநியோகம் கிடைக்கும்', Home: 'முகப்பு', Products: 'பொருட்கள்', 'About Us': 'எங்களைப் பற்றி', 'Sign In': 'உள்நுழைய', 'Kalpitiya, Sri Lanka': 'கற்பிட்டி, இலங்கை', 'Fresh Seafood • Islandwide Delivery': 'புதிய கடல் உணவு • நாடு முழுவதும் விநியோகம்', 'Serving Sri Lanka': 'இலங்கைக்கு சேவை', 'Delivery in all 25 districts': '25 மாவட்டங்களிலும் விநியோகம்', "Hand-picked daily from Kalpitiya's coastal waters.": 'கற்பிட்டி கடலோரத்திலிருந்து தினமும் கவனமாகத் தேர்ந்தெடுக்கப்பட்டது.', 'Delivery available across all 25 districts of Sri Lanka — with Puttalam as our home base and fastest delivery area.': 'இலங்கையின் 25 மாவட்டங்களுக்கும் விநியோகம் கிடைக்கும் — புத்தளம் எங்கள் மையமும் விரைவான விநியோகப் பகுதியும் ஆகும்.',
    'Fresh Seafood Delivered to Your Door': 'புதிய கடல் உணவு உங்கள் வீடு தேடி', 'Shop Seafood': 'கடல் உணவு வாங்குங்கள்', 'Order on WhatsApp': 'WhatsApp-ல் ஆர்டர் செய்யுங்கள்', 'Fresh Catch This Week': 'இந்த வாரத்தின் புதிய பிடிப்பு', 'View All': 'அனைத்தையும் காண்க', 'View All Products': 'அனைத்து பொருட்களையும் காண்க', 'Islandwide Seafood Delivery': 'நாடு முழுவதும் கடல் உணவு விநியோகம்', 'See All 25 Districts': '25 மாவட்டங்களையும் காண்க', 'Frequently Asked Questions': 'அடிக்கடி கேட்கப்படும் கேள்விகள்', All: 'அனைத்தும்', 'All Seafood Products': 'அனைத்து கடல் உணவுப் பொருட்கள்', 'Search seafood...': 'கடல் உணவைத் தேடுங்கள்...', 'No products found. Try a different category or search term.': 'பொருட்கள் கிடைக்கவில்லை. வேறு வகை அல்லது தேடல் சொல்லை முயற்சிக்கவும்.',
    'Minimum Quantity:': 'குறைந்தபட்ச அளவு:', 'Starting from': 'தொடக்கம்', 'View Product': 'பொருளைக் காண்க', Add: 'சேர்', 'WhatsApp Order': 'WhatsApp ஆர்டர்', 'Daily Catch': 'இன்றைய பிடிப்பு', 'Fresh Seafood': 'புதிய கடல் உணவு', 'Quality Guaranteed': 'தரம் உறுதி', 'Easy WhatsApp Ordering': 'எளிய WhatsApp ஆர்டர்', 'Quick Links': 'விரைவு இணைப்புகள்', 'Customer Support': 'வாடிக்கையாளர் உதவி', 'Location & Delivery': 'இடம் மற்றும் விநியோகம்',
    'About RSN Sea Food': 'RSN Sea Food பற்றி', 'Domestic Retail & HORECA': 'உள்நாட்டு சில்லறை மற்றும் HORECA', 'International Export': 'சர்வதேச ஏற்றுமதி', 'Kalpitiya Fishermen Partners': 'கற்பிட்டி மீனவர் கூட்டாளிகள்', 'Search your district...': 'உங்கள் மாவட்டத்தைத் தேடுங்கள்...', DEFAULT: 'இயல்புநிலை', 'No matching district found.': 'பொருந்தும் மாவட்டம் இல்லை.',
  },
  si: {
    Support: 'සහාය', FAQ: 'නිතර අසන ප්‍රශ්න', 'Delivery Areas': 'බෙදාහැරීමේ ප්‍රදේශ', 'Submit Your Inquiry': 'ඔබගේ විමසීම යොමු කරන්න', 'Delivery Available': 'බෙදාහැරීම තිබේ', Home: 'මුල් පිටුව', Products: 'නිෂ්පාදන', 'About Us': 'අප ගැන', 'Sign In': 'පිවිසෙන්න', 'Kalpitiya, Sri Lanka': 'කල්පිටිය, ශ්‍රී ලංකාව', 'Fresh Seafood • Islandwide Delivery': 'නැවුම් මුහුදු ආහාර • දිවයින පුරා බෙදාහැරීම', 'Serving Sri Lanka': 'ශ්‍රී ලංකාවට සේවය', 'Delivery in all 25 districts': 'දිස්ත්‍රික්ක 25ටම බෙදාහැරීම', "Hand-picked daily from Kalpitiya's coastal waters.": 'කල්පිටිය වෙරළ තීරයෙන් දිනපතා තෝරාගනු ලැබේ.', 'Delivery available across all 25 districts of Sri Lanka — with Puttalam as our home base and fastest delivery area.': 'ශ්‍රී ලංකාවේ දිස්ත්‍රික්ක 25ටම බෙදාහැරීම තිබේ — පුත්තලම අපගේ මූලික සහ වේගවත්ම බෙදාහැරීමේ ප්‍රදේශයයි.',
    'Fresh Seafood Delivered to Your Door': 'නැවුම් මුහුදු ආහාර ඔබේ නිවසටම', 'Shop Seafood': 'මුහුදු ආහාර මිලදී ගන්න', 'Order on WhatsApp': 'WhatsApp හරහා ඇණවුම් කරන්න', 'Fresh Catch This Week': 'මෙම සතියේ නැවුම් අස්වැන්න', 'View All': 'සියල්ල බලන්න', 'View All Products': 'සියලු නිෂ්පාදන බලන්න', 'Islandwide Seafood Delivery': 'දිවයින පුරා මුහුදු ආහාර බෙදාහැරීම', 'See All 25 Districts': 'දිස්ත්‍රික්ක 25ම බලන්න', 'Frequently Asked Questions': 'නිතර අසන ප්‍රශ්න', All: 'සියල්ල', 'All Seafood Products': 'සියලු මුහුදු ආහාර නිෂ්පාදන', 'Search seafood...': 'මුහුදු ආහාර සොයන්න...', 'No products found. Try a different category or search term.': 'නිෂ්පාදන හමු නොවීය. වෙනත් කාණ්ඩයක් හෝ සෙවුම් වචනයක් උත්සාහ කරන්න.',
    'Minimum Quantity:': 'අවම ප්‍රමාණය:', 'Starting from': 'ආරම්භයේ සිට', 'View Product': 'නිෂ්පාදනය බලන්න', Add: 'එකතු කරන්න', 'WhatsApp Order': 'WhatsApp ඇණවුම', 'Daily Catch': 'දිනපතා අස්වැන්න', 'Fresh Seafood': 'නැවුම් මුහුදු ආහාර', 'Quality Guaranteed': 'ගුණාත්මකභාවය සහතිකයි', 'Easy WhatsApp Ordering': 'පහසු WhatsApp ඇණවුම', 'Quick Links': 'ඉක්මන් සබැඳි', 'Customer Support': 'පාරිභෝගික සහාය', 'Location & Delivery': 'ස්ථානය සහ බෙදාහැරීම',
    'About RSN Sea Food': 'RSN Sea Food ගැන', 'Domestic Retail & HORECA': 'දේශීය සිල්ලර හා HORECA', 'International Export': 'ජාත්‍යන්තර අපනයනය', 'Kalpitiya Fishermen Partners': 'කල්පිටිය ධීවර හවුල්කරුවන්', 'Search your district...': 'ඔබගේ දිස්ත්‍රික්කය සොයන්න...', DEFAULT: 'පෙරනිමි', 'No matching district found.': 'ගැළපෙන දිස්ත්‍රික්කයක් හමු නොවීය.',
  },
};

const LanguageContext = createContext(null);
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  useEffect(() => { const saved = localStorage.getItem('rsn-language'); if (translations[saved]) setLanguage(saved); }, []);
  useEffect(() => { document.documentElement.lang = language; localStorage.setItem('rsn-language', language); }, [language]);
  const t = (text) => translations[language]?.[text] || text;
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
