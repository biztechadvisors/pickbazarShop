import { useCallback, useEffect } from 'react';
import useRazorpay, { RazorpayOptions } from '@/lib/use-razorpay';
import { formatAddress } from '@/lib/format-address';
import { PaymentGateway, PaymentIntentInfo } from '@/types';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useSettings } from '@/framework/settings';
import { useOrder, useOrderPayment } from '@/framework/order';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import client from '@/framework/client';

interface Props {
  paymentIntentInfo: PaymentIntentInfo;
  trackingNumber: string;
  paymentGateway: PaymentGateway;
}

const RazorpayPaymentModal: React.FC<Props> = ({
  trackingNumber,
  paymentIntentInfo,
  paymentGateway,
}) => {
  const { t } = useTranslation();
  const { closeModal } = useModalAction();
  const { loadRazorpayScript, checkScriptLoaded } = useRazorpay();
  const { settings, isLoading: isSettingsLoading } = useSettings();
  const { order, isLoading, refetch } = useOrder({
    tracking_number: trackingNumber,
  });
  const { createOrderPayment } = useOrderPayment();
  // @ts-ignore
  const { customer_name, customer_contact, customer, billing_address } =
    order ?? {};
  const paymentHandle = useCallback(async () => {
    if (!checkScriptLoaded()) {
      await loadRazorpayScript();
    }
    const __DEV__ = document.domain === "localhost";
    const options: RazorpayOptions = {
      key: __DEV__ ? "rzp_test_5pZjAxubHkUaGo" : "m2eUDWAactAclyIvFABxZ1Kh",
      amount: paymentIntentInfo?.amount!,
      currency: paymentIntentInfo?.currency!,
      name: customer_name!,
      description: `${t('text-order')}#${trackingNumber}`,
      image: settings?.logo?.original!,
      order_id: paymentIntentInfo?.order_id!,
      handler: async (response) => {
        closeModal();
        client.orders.savePaymentId(response).then(paymentIntentInfo => {
          createOrderPayment({
            tracking_number: trackingNumber!,
            payment_gateway: 'razorpay' as string,
            paymentIntentInfo: paymentIntentInfo,
          });
        });
      },

      prefill: {
        ...(customer_name && { name: customer_name }),
        ...(customer_contact && { contact: `+${customer_contact}` }),
        ...(customer?.email && { email: customer?.email }),
      },
      notes: {
        address: formatAddress(billing_address as any),
      },
      modal: {
        ondismiss: async () => {
          closeModal();
          await refetch();
        },
      },
    };
    const razorpay = (window as any).Razorpay(options);
    return razorpay.open();
  }, [isLoading, isSettingsLoading]);

  useEffect(() => {
    if (!isLoading && !isSettingsLoading) {
      (async () => {
        await paymentHandle();
      })();
    }
  }, [isLoading, isSettingsLoading]);

  if (isLoading || isSettingsLoading) {
    return <Spinner showText={false} />;
  }

  return null;
};

export default RazorpayPaymentModal;
