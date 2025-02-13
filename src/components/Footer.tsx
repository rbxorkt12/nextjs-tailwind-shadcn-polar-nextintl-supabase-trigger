import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export function Footer() {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container px-4 md:px-6 py-12 sm:py-16 mx-auto max-w-7xl">
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-lg font-semibold mb-4">{t('footer.company.title')}</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            {t('footer.company.description')}
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-white">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </a>
                            <a href="#" className="hover:text-white">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.373 0 0 5.373 0 12 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3 8h-1.35c-.538 0-.65.221-.65.778V10h2l-.209 2H13v7h-3v-7H8v-2h2V7.692C10 5.923 10.931 5 13.029 5H15v3z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('footer.products.title')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white">{t('footer.products.features')}</a></li>
                            <li><a href="#" className="hover:text-white">{t('footer.products.pricing')}</a></li>
                            <li><a href="#" className="hover:text-white">{t('footer.products.demo')}</a></li>
                            <li><a href="#" className="hover:text-white">{t('footer.products.api')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('footer.company.title')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white">{t('footer.company.about')}</a></li>
                            <li><a href="#" className="hover:text-white">{t('footer.company.blog')}</a></li>
                            <li><a href="#" className="hover:text-white">{t('footer.company.careers')}</a></li>
                            <li><a href="#" className="hover:text-white">{t('footer.company.contact')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('footer.support.title')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white">{t('footer.support.helpCenter')}</a></li>
                            <li><a href="#" className="hover:text-white">{t('footer.support.documentation')}</a></li>
                            <li><a href="#" className="hover:text-white">{t('footer.support.status')}</a></li>
                            <li><a href="#" className="hover:text-white">{t('footer.support.security')}</a></li>
                        </ul>
                    </div>
                </div> */}

                <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-8 text-sm text-gray-400">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <div className="mb-4 sm:mb-0">
                            {t('footer.copyright')}
                        </div>
                        <div className="flex space-x-6">
                            <Link href={`/${locale}/terms`} className="hover:text-white">{t('footer.legal.terms')}</Link>
                            <Link href={`/${locale}/privacy`} className="hover:text-white">{t('footer.legal.privacy')}</Link>
                            <Link href={`/${locale}/cookies`} className="hover:text-white">{t('footer.legal.cookies')}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
} 