import styles from './MiniCart.module.css';
import { getCartItemsLocalStorage } from '../../cartItemsLocalStorage';
import CartItem from '../../components/CartItem/CartItem';
import { useEffect, useState } from 'react';
import { 
  NavLink, 
} from 'react-router-dom';
import { useMiniCart } from './MiniCartContext';

function MiniCart() {
  const [itemsData, setItemsData] = useState(getCartItemsLocalStorage());

  const totalItems = itemsData.reduce((itemCount, item) => { return itemCount + Number(item.quantity); }, 0);
  const subtotal = itemsData.reduce((itemCount, item) => { return itemCount + Number(item.quantity)*Number(item.price); }, 0);
  const subtotalRounded = Number(+(Math.round(subtotal* 100 / 100 + "e+2")  + "e-2")).toFixed(2);

  const { cartIsOpen, openMiniCart, closeMiniCart, miniCartItems } = useMiniCart();

  // prevent page from scrolling when mini cart is opened.
  // add margin right to replace width of disappearing scrollbar (if there is)
  // so that the page doesn't move to the right.
  useEffect(() => {
    const body = document.body;

    function verticalScrollbarVisible() {
      return window.innerWidth > body.clientWidth;
    }

    if (cartIsOpen) {
      if (verticalScrollbarVisible()) {
        let scrollbarLength = window.innerWidth - body.clientWidth;
        body.style.marginRight = cartIsOpen ? `${scrollbarLength}px` : '0px';
      }
      body.style.overflow = cartIsOpen ? 'hidden' : 'auto';
    }

    return () => {
      if (verticalScrollbarVisible()) {
        body.style.marginRight = '0px';
      }
      body.style.overflow = 'auto';
    };
  }, [cartIsOpen]);

  useEffect(() => {
    const handleCartItemsChange = () => {
      setItemsData(getCartItemsLocalStorage());
    };

    window.addEventListener('cartItemsChanged', handleCartItemsChange);

    return () => {
      window.removeEventListener('cartItemsChanged', handleCartItemsChange);
    };
  }, []);

  function handleNavLinkClick() {
    closeMiniCart();
  }

  return (
    <>
      <div className={`${styles.overlay} ${cartIsOpen ? styles.open : ''}`} onClick={closeMiniCart}></div>
      <div className={`${styles.miniCartContainer} ${cartIsOpen ? styles.open : ''}`}>
        <header>
          <div className={styles.headerLeft}>
            <i className='fa fa-2x fa-shopping-cart'></i>
            <h1>My Cart ({totalItems})</h1>
          </div>
          <i 
            className={`${styles.closeButton} fa fa-2x fa-close`} 
            onClick={closeMiniCart}
            data-testid='miniCartCloseButton'
          />
        </header>
        {totalItems > 0  ? (
          <div className={styles.miniCart}>
            <div className={styles.cartItems} ref={miniCartItems}>
              {itemsData.map((item) => {
                return (
                  <CartItem 
                    key={`${item.productId}-${item.productType}`} 
                    itemData={item}
                    handleNavLinkClick={handleNavLinkClick}
                  />
                )
              })}
            </div>
            <div className={styles.miniCartFooter}>
              <h1 className={styles.totalText}>
                Subtotal: ${subtotalRounded}
                <p>Shipping & taxes are calculated at checkout</p>
              </h1>
              <NavLink to={'/cart'} onClick={handleNavLinkClick}>
                <button className={styles.viewCartButton} data-testid='viewCartButton'>VIEW CART</button>
              </NavLink>
              {/* <NavLink> */}
              <button className={styles.checkoutButton}>CHECKOUT</button>
              {/* </NavLink> */}
            </div>
          </div>
        ) : (
          <div className={styles.emptyCart}>
            <p>Your Shopping Cart is Empty</p>
            <NavLink to={`/shop`} onClick={handleNavLinkClick}>
              <button>CONTINUE SHOPPING</button>
            </NavLink>
          </div>
        )}
      </div>
    </>
  )
}

export default MiniCart;
