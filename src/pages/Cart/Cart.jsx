import styles from './Cart.module.css';
import { getCartItemsLocalStorage } from '../../cartItemsLocalStorage';
import CartItem from '../../components/CartItem/CartItem';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

function Cart() {
  const [itemsData, setItemsData] = useState(getCartItemsLocalStorage());
  
  const totalItems = itemsData.reduce((itemCount, item) => { return itemCount + Number(item.quantity); }, 0);
  const subtotal = itemsData.reduce((itemCount, item) => { return itemCount + Number(item.quantity)*Number(item.price); }, 0);
  const subtotalRounded = Number(+(Math.round(subtotal* 100 / 100 + "e+2")  + "e-2")).toFixed(2);
  console.log(totalItems)
  console.log(itemsData)

  useEffect(() => {
    const handleCartItemsChange = () => {
      setItemsData(getCartItemsLocalStorage());
    };

    window.addEventListener('cartItemsChanged', handleCartItemsChange);

    return () => {
      window.removeEventListener('cartItemsChanged', handleCartItemsChange);
    };
  }, []);

  return (
    <>
      {totalItems > 0 &&
      <div className={styles.cart}>
        <header>
          <h1>My Cart ({totalItems})</h1>
        </header>
        <div className={styles.cartItems}>
          {itemsData.map((item) => {
            return (
              <CartItem 
                key={`${item.productId}-${item.productType}`} 
                itemData={item}
              />
            )
          })}
        </div>
        <div className={styles.orderSummary}>
          <h1 className={styles.subtotalText}>Subtotal ({totalItems} {totalItems > 1 ? 'items' : 'item'}): ${subtotalRounded}</h1>
        </div>
      </div>}
      {totalItems <= 0 &&
      <div className={styles.emptyCart}>
        <p>Your Shopping Cart is Empty</p>
        <NavLink to={`/shop`}>
          <button>CONTINUE SHOPPING</button>
        </NavLink>
      </div>
      }
    </>
  )
}

export default Cart;
