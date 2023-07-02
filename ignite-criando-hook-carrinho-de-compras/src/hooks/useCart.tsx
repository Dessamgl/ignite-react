import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const productsStock = await api.get<Stock>(`/stock/${productId}`);
      const productsInStock = productsStock.data;
      
      const productsList = await api.get<Product>(`/products/${productId}`);
      const products = productsList.data;
 
      const productExistInCart = cart.find(product => product.id === productId);
      
      if (!productExistInCart) {
        if (productsInStock.amount > 0) {
          const newProduct = {
            ...products,
            amount: 1
          }
          setCart([...cart, newProduct]);
          localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart, newProduct]));
          return;
        }
      }

      if (productExistInCart) {
        if (productsInStock.amount > productExistInCart.amount) {

          const addAmount = cart.map(product => product.id === productId ? {
            ...product,
            amount: Number(product.amount) + 1
          } : product);

            setCart(addAmount);
            localStorage.setItem('@RocketShoes:cart', JSON.stringify(addAmount))
            return;
        } else {
          toast.error('Quantidade solicitada fora de estoque');
        }
      }
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const productExistInCart = cart.some(product => product.id === productId);

      if(!productExistInCart) {
        toast.error('Erro na remoção do produto');
        return;
      }
      const removeProductFromCart = cart.filter(product => product.id !== productId);
      setCart(removeProductFromCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(removeProductFromCart));

    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if(amount <= 0) {
        return;
      }

      const productsStock = await api.get<Stock>(`/stock/${productId}`);
      const productsInStock = productsStock.data;

      if (productsInStock.amount < amount){
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      const addAmount = cart.map(product => product.id === productId ? {
        ...product,
        amount,
      } : product);

      setCart(addAmount);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(addAmount))
    
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
