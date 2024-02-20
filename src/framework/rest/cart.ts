import type { CustomerData } from '@/types';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const useCartsMutation = () => {
    const queryClient = useQueryClient();
    // const { t } = useTranslation();
    
    return useMutation(client.carts.create, {
      onSuccess: () => {
        toast.success('Cart Updated');
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.CARTS);
      },
    });
  };

  export const useCartsDelMutation = () => {
    const queryClient = useQueryClient();
    // const { t } = useTranslation();
    
    return useMutation(client.carts.clearCarts, {
      onSuccess: () => {
        toast.success('Cart Cleared');
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.CARTS);
      },
    });
  };
