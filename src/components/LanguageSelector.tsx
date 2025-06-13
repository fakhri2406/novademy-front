import React from 'react';
import { useLanguage, Language } from '../i18n/LanguageContext';
import { useTranslation } from '../i18n/useTranslation';
import { Dropdown } from 'react-bootstrap';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const languages: { code: Language; name: string }[] = [
    { code: 'az', name: t('azerbaijani') },
    { code: 'en', name: t('english') },
    { code: 'ru', name: t('russian') },
  ];

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" id="language-dropdown">
        {t('language')}: {languages.find(lang => lang.code === language)?.name}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {languages.map((lang) => (
          <Dropdown.Item
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            active={language === lang.code}
          >
            {lang.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSelector; 