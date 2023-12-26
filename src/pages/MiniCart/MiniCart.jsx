import styles from './MiniCart.module.css';
import { getCartItemsLocalStorage } from '../../cartItemsLocalStorage';
import CartItem from '../../components/CartItem/CartItem';
import { useEffect, useState } from 'react';
import { 
  NavLink, 
} from 'react-router-dom';

function MiniCart({
  isOpen,
  setMiniCartIsOpen,
}) {
  const [itemsData, setItemsData] = useState(getCartItemsLocalStorage());

  const totalItems = itemsData.reduce((itemCount, item) => { return itemCount + Number(item.quantity); }, 0);
  const subtotal = itemsData.reduce((itemCount, item) => { return itemCount + Number(item.quantity)*Number(item.price); }, 0);
  const subtotalRounded = Number(+(Math.round(subtotal* 100 / 100 + "e+2")  + "e-2")).toFixed(2);

  // prevent page from scrolling when mini cart is opened.
  // add margin right to replace width of disappearing scrollbar (if there is)
  // so that the page doesn't move to the right.
  useEffect(() => {
    const body = document.body;

    function verticalScrollbarVisible() {
      return window.innerWidth > body.clientWidth;
    }

    if (isOpen) {
      if (verticalScrollbarVisible()) {
        let scrollbarLength = window.innerWidth - body.clientWidth;
        body.style.marginRight = isOpen ? `${scrollbarLength}px` : '0px';
      }
      body.style.overflow = isOpen ? 'hidden' : 'auto';
    }
    return () => {
      body.style.overflow = 'auto';
      body.style.marginRight = '0px';
    };
  }, [isOpen]);

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
    setMiniCartIsOpen(false);
  }

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={() => setMiniCartIsOpen(false)}></div>
      <div className={`${styles.miniCartContainer} ${isOpen ? styles.open : ''}`}>
        <header>
          <div className={styles.headerLeft}>
            <i className='fa fa-2x fa-shopping-cart'></i>
            <h1>My Cart ({totalItems})</h1>
          </div>
          <i className={`${styles.closeButton} fa fa-2x fa-close`} onClick={() => setMiniCartIsOpen(false)}></i>
        </header>
        {totalItems > 0  ? (
          <div className={styles.miniCart}>
            <div className={styles.cartItems}>
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
                <button className={styles.viewCartButton}>VIEW CART</button>
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
