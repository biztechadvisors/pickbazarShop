import React, { useCallback } from 'react';
import { cartReducer, State, initialState } from './cart.reducer';
import { Item, getItem, inStock } from './cart.utils';
import { useLocalStorage } from '@/lib/use-local-storage';
import { CART_KEY } from '@/lib/constants';
import { useAtom } from 'jotai';
import { verifiedResponseAtom } from '@/store/checkout';
import { useCartsMutation } from '@/framework/cart';
interface CartProviderState extends State {
  // addItemsToCart: (items: Item[]) => void;
  addItemToCart: (item: Item, quantity: number, customerId:number, email:string, phone:string) => void;
  // removeItemFromCart: (id: Item['id']) => void;
  removeItemFromCart: (id: Item['id'],item: Item, quantity: number, customerId:number, email:string, phone:string) => void;

  clearItemFromCart: (id: Item['id'],email:string) => void;
  getItemFromCart: (id: Item['id']) => any | undefined;
  isInCart: (id: Item['id']) => boolean;
  isInStock: (id: Item['id']) => boolean;
  resetCart: () => void;
  updateCartLanguage: (language: string) => void;
}
export const cartContext = React.createContext<CartProviderState | undefined>(
  undefined
);

cartContext.displayName = 'CartContext';

export const useCart = () => {
  const context = React.useContext(cartContext);
  if (context === undefined) {
    throw new Error(`useCart must be used within a CartProvider`);
  }
  return React.useMemo(() => context, [context]);
};

export const CartProvider: React.FC<{ children?: React.ReactNode }> = (
  props
) => {
  const [savedCart, saveCart] = useLocalStorage(
    CART_KEY,
    JSON.stringify(initialState)
  );
  const [state, dispatch] = React.useReducer(
    cartReducer,
    savedCart ? JSON.parse(savedCart) : initialState
  );
  const [, emptyVerifiedResponse] = useAtom(verifiedResponseAtom);
  const { mutate: createCart, isLoading: creating } = useCartsMutation();
  React.useEffect(() => {
    emptyVerifiedResponse(null);
  }, [emptyVerifiedResponse, state]);

  React.useEffect(() => {
    saveCart(JSON.stringify(state));
    const data = {
      customerId: state.customerId,
      email:state.email,
      phone:state.phone,
      cartData:{
          ...state.items
      },
    }
    console.log("mycartSaved2", data)
    createCart(data)
  }, [state, saveCart]);


  // const addItemsToCart = (items: Item[]) =>
  //   dispatch({ type: 'ADD_ITEMS_WITH_QUANTITY', items });
  // const addItemToCart = (item: Item, quantity: number) =>
  //   dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', item, quantity });
  const addItemToCart = (item: Item, quantity: number, customerId:number, email:string, phone:string) =>
    dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', item, quantity, customerId, email, phone });
  const removeItemFromCart = (id: Item['id'],item: Item, quantity: number, customerId:number, email:string, phone:string) =>
    dispatch({ type: 'REMOVE_ITEM_OR_QUANTITY', id, item, quantity, customerId, email, phone});
  const clearItemFromCart = (id: Item['id'],email:string) =>
    dispatch({ type: 'REMOVE_ITEM', id, email });
  const isInCart = useCallback(
    (id: Item['id']) => !!getItem(state.items, id),
    [state.items]
  );
  const getItemFromCart = useCallback(
    (id: Item['id']) => getItem(state.items, id),
    [state.items]
  );
  const isInStock = useCallback(
    (id: Item['id']) => inStock(state.items, id),
    [state.items]
  );
  const updateCartLanguage = (language: string) =>
    dispatch({ type: 'UPDATE_CART_LANGUAGE', language });
  const resetCart = () => dispatch({ type: 'RESET_CART' });
  const value = React.useMemo(
    () => ({
      ...state,
      // addItemsToCart,
      addItemToCart,
      removeItemFromCart,
      clearItemFromCart,
      getItemFromCart,
      isInCart,
      isInStock,
      resetCart,
      updateCartLanguage,
    }),
    [getItemFromCart, isInCart, isInStock, state]
  );
  return <cartContext.Provider value={value} {...props} />;
};
