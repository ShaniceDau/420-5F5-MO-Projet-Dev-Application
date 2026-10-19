import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
    //accéder à la langue active et l'a changé
    const { i18n } = useTranslation();

    //changer la langue du site
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="lang_switcher">
            <button
                className={`lang_btn ${i18n.language === 'fr' ? 'lang_btn_active' : ''}`}
                onClick={() => changeLanguage('fr')}
            >
                FR
            </button>
            <span className="lang_divider">|</span>
            <button
                className={`lang_btn ${i18n.language === 'en' ? 'lang_btn_active' : ''}`}
                onClick={() => changeLanguage('en')}
            >
                EN
            </button>
        </div>
    );
}
