import MobileOtpInput from 'react-otp-input';
import Button from '@/components/ui/button';
import Label from '@/components/ui/forms/label';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { Form } from '@/components/ui/forms/form';
import { Controller } from 'react-hook-form';
import * as yup from 'yup';
import { useTranslation } from 'next-i18next';
import Logo from '@/components/ui/logo';
import OtpRegisterForm from '../otp/otp-register-form';


export default function Otp() {
    const { t } = useTranslation('common');
    const { openModal } = useModalAction();
  
    return (
      <div className="flex h-screen w-screen flex-col justify-center bg-light px-5 py-6 sm:p-8 md:h-auto md:max-w-md md:rounded-xl">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="mt-4 mb-7 text-center text-sm leading-relaxed text-body sm:mt-5 sm:mb-10 md:text-base">
          {t('Enter Your Otp')}
        </p>
        <OtpRegisterForm/>
        <div className="relative mt-9 mb-7 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
          <hr className="w-full" />
          <span className="absolute -top-2.5 bg-light px-2 ltr:left-2/4 ltr:-ml-4 rtl:right-2/4 rtl:-mr-4">
            {t('text-or')}
          </span>
        </div>
        <div className="text-center text-sm text-body sm:text-base">
          {t('text-back-to')}{' '}
          <button
            onClick={() => openModal('LOGIN_VIEW')}
            className="font-semibold text-accent underline transition-colors duration-200 hover:text-accent-hover hover:no-underline focus:text-accent-hover focus:no-underline focus:outline-0 ltr:ml-1 rtl:mr-1"
          >
            {t('text-login')}
          </button>
        </div>
      </div>
    );
  }
  
