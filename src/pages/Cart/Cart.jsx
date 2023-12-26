import styles from './Cart.module.css';
import { getCartItemsLocalStorage } from '../../cartItemsLocalStorage';
import CartItem from '../../components/CartItem/CartItem';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useMediaQuery } from '@react-hook/media-query';

function Cart() {
  const [itemsData, setItemsData] = useState(getCartItemsLocalStorage());
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const totalItems = itemsData.reduce((itemCount, item) => { return itemCount + Number(item.quantity); }, 0);
  const subtotal = itemsData.reduce((itemCount, item) => { return itemCount + Number(item.quantity)*Number(item.price); }, 0);
  const subtotalRounded = Number((Math.round(subtotal* 100 / 100 + "e+2")  + "e-2")).toFixed(2);
  const estimatedTax = (subtotalRounded*0.15).toFixed(2);
  const total = (Number(subtotalRounded)+Number(estimatedTax)).toFixed(2);

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
        <div className={styles.cartItems}>
          <header>
            <h1>My Cart ({totalItems})</h1>
          </header>
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
          <p className={styles.orderSummaryText}>Order Summary</p>
          <div className={styles.orderSummarySmallText}>
            <div className={styles.smallText}>
              <p className={styles.orderSubtotalText}>Order Subtotal</p>
              <p>${subtotalRounded}</p>
            </div>
            <div className={styles.smallText}>
              <p className={styles.estimatedShippingText}>Estimated Shipping</p>
              <p>FREE</p>
            </div>
            <div className={styles.smallText}>
              <p className={styles.estimatedTaxText}>Estimated Tax</p>
              <p>${estimatedTax}</p>
            </div>
          </div>
          {!isSmallScreen &&
          <div className={styles.totalAndCheckout}>
            <div className={styles.total}>
              <p className={styles.totalText}>Total</p>
              <p>${total}</p>
            </div>
            <button className={styles.checkoutButton}>CHECKOUT</button>
          </div>}
        </div>
        {isSmallScreen &&
        <div className={styles.totalAndCheckout}>
          <div className={styles.total}>
            <p className={styles.totalText}>Total</p>
            <p>${total}</p>
          </div>
          <button className={styles.checkoutButton}>CHECKOUT</button>
        </div>}
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
