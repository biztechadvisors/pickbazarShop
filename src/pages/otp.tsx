// import Accordion from '@/components/ui/accordion';
// import { faq } from '@/framework/static/faq';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { useTranslation } from 'next-i18next';
// import { GetStaticProps } from 'next';
// import { getLayout } from '@/components/layouts/layout';
// import Seo from '@/components/seo/seo';

// export default function OtpPage() {
//   const { t } = useTranslation();
//   return (
//     <>
//       <Seo title="Help" url="help" />
//       <section className="py-8 px-4 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
//         <header className="mb-8 text-center">
//           <h1 className="text-xl font-bold md:text-2xl xl:text-3xl">
//             {t('common:nav-menu-faq')}
//           </h1>
//         </header>
//         <div className="mx-auto w-full max-w-screen-lg">
//           <Accordion items={faq} translatorNS="faq" />
//         </div>
//       </section>
//     </>
//   );
// }

// OtpPage.getLayout = getLayout;

// export const getStaticProps: GetStaticProps = async ({ locale }) => {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale!, ['common', 'faq'])),
//     },
//   };
// };
import OtpCodeForm from '@/components/otp/code-verify-form'
import OtpForm from '@/components/otp/otp-form'
import React from 'react'

const otp = () => {
  return (
    <div className='flex h-full min-h-screen w-screen flex-col justify-center bg-light py-6 px-5 sm:p-8 md:h-auto md:min-h-0 md:max-w-[480px] md:rounded-xl'><OtpCodeForm /></div>
  )
}

export default otp