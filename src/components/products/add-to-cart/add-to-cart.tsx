import Counter from '@/components/ui/counter';
import AddToCartBtn from '@/components/products/add-to-cart/add-to-cart-btn';
import { cartAnimation } from '@/lib/cart-animation';
import { useCart } from '@/store/quick-cart/cart.context';
import { generateCartItem } from '@/store/quick-cart/generate-cart-item';
import { useUser } from '@/framework/user';

interface Props {
  data: any;
  variant?:
  | 'helium'
  | 'neon'
  | 'argon'
  | 'oganesson'
  | 'single'
  | 'big'
  | 'text';
  counterVariant?:
  | 'helium'
  | 'neon'
  | 'argon'
  | 'oganesson'
  | 'single'
  | 'details';
  counterClass?: string;
  variation?: any;
  disabled?: boolean;
}

export interface CustomerData {
  customerId: number;
  email: string;
  phone: string;
  cartData: any;
  quantity: number;
}

export const AddToCart = ({
  data,
  variant = 'helium',
  counterVariant,
  counterClass,
  variation,
  disabled,
}: Props) => {
  const {
    addItemToCart,
    removeItemFromCart,
    isInStock,
    getItemFromCart,
    isInCart,
    updateCartLanguage,
    language,
  } = useCart();
  const { me }:any = useUser();
  const item = generateCartItem(data, variation);
  console.log("newitem", item)
  const handleAddClick = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    e.stopPropagation();
    // Check language and update
    if (item?.language !== language) {
      updateCartLanguage(item?.language);
    }
    // addItemToCart(item, 1);
    
    const customerData: CustomerData = {
      customerId: 10,
      email: "arman.codenox@gmail.com",
      phone: '8770144721',
      cartData: item,
    };
    addItemToCart(
      customerData,
      1,
      customerData.customerId,
      customerData.email, 
      customerData.phone, 
      )

    if (!isInCart(item.id)) {
      cartAnimation(e);
    }
  };
  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCart(item.id);
  };
  const outOfStock = isInCart(item?.id) && !isInStock(item.id);
  return !isInCart(item?.id) ? (
    <div>
      <AddToCartBtn
        disabled={
          disabled || outOfStock || data.status.toLowerCase() != 'publish'
        }
        variant={variant}
        onClick={handleAddClick}
      />
    </div>
  ) : (
    <>
      <Counter
        value={getItemFromCart(item.id).quantity}
        onDecrement={handleRemoveClick}
        onIncrement={handleAddClick}
        variant={counterVariant || variant}
        className={counterClass}
        disabled={outOfStock}
      />
    </>
  );
};
