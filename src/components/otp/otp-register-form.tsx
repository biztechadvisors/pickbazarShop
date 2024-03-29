import { useTranslation } from 'next-i18next';
import MobileOtpInput from 'react-otp-input';
import Button from '@/components/ui/button';
import Input from '@/components/ui/forms/input';
import Label from '@/components/ui/forms/label';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { Form } from '@/components/ui/forms/form';
import { Controller } from 'react-hook-form';
import * as yup from 'yup';
import { useVerifyOtpCode, useResendOtp } from '@/framework/user';
import { Data } from '@react-google-maps/api';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/authorization-atom';

interface OtpRegisterFormProps {
  onSubmit: (formData: any) => void;
  loading: boolean;
}

type OtpRegisterFormValues = {
  // email: string;
  // name: string;
  code: string;
};

const otpLoginFormSchemaForNewUser = yup.object().shape({
  // email: yup
  //   .string()
  //   .email('error-email-format')
  //   .required('error-email-required'),
  // name: yup.string().required('error-name-required'),
  code: yup.string().required('error-code-required'),
});

export default function OtpRegisterForm({
  onSubmit,
  loading,
}: OtpRegisterFormProps) {
  const { t } = useTranslation('common');
  const { closeModal } = useModalAction();

  const {mutate:verifyOtp, isLoading} = useVerifyOtpCode();
  const { mutate: resendOtp, isLoading: isResendingOtp } = useResendOtp(); 
  const [getUser] =useAtom(userAtom);

  const handleResendOtp = () => {
    resendOtp(getUser); 
  };
  return (
    <div className="space-y-5 rounded border border-gray-200 p-5">
      <Form<OtpRegisterFormValues>
        onSubmit={(data:any)=>{
          console.log("submitData",data)
          verifyOtp(data)
        }}
        validationSchema={otpLoginFormSchemaForNewUser}
      >
        {({ register, control, formState: { errors } }) => (
          <>
            {/* <Input
              label={t('text-email')}
              {...register('email')}
              type="email"
              variant="outline"
              className="mb-5"
              error={t(errors.email?.message!)}
            />
            <Input
              label={t('text-name')}
              {...register('name')}
              variant="outline"
              className="mb-5"
              error={t(errors.name?.message!)}
            /> */}

            <div className="mb-5">
              <Label>{t('text-otp-code')}</Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MobileOtpInput
                    value={value}
                    onChange={onChange}
                    numInputs={4}
                    separator={
                      <span className="hidden sm:inline-block">-</span>
                    }
                    containerStyle="flex items-center justify-between -mx-2"
                    inputStyle="flex items-center justify-center !w-full mx-2 sm:!w-9 !px-0 appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-0 focus:ring-0 border border-border-base rounded focus:border-accent h-12"
                    disabledStyle="!bg-gray-100"
                  />
                )}
                name="code"
                defaultValue=""
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Button
                variant="outline"
                // className="hover:border-red-500 hover:bg-red-500"
                onClick={() =>handleResendOtp(Data)}
                disabled={isResendingOtp}
              >
               {isResendingOtp ? t('text-resending-otp') : t('text-resend-otp')} {/* Change button text based on loading state */}
              </Button>

              <Button loading={loading} disabled={loading}>
                {t('text-verify-code')}
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}
