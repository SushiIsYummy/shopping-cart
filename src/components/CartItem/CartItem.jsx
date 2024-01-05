import { useEffect, useState } from 'react';
import styles from './CartItem.module.css';
import { changeCartItemQuantity, removeFromCart } from '../../cartItemsLocalStorage';
import { NavLink } from 'react-router-dom';
function CartItem({
  itemData,
  handleNavLinkClick,
}) {
  const { quantity, productId, productType, price, productTitle, productImage } = itemData;
  const [totalPrice, setTotalPrice] = useState(Number(quantity)*Number(price));

  useEffect(() => {
    setTotalPrice(Number(quantity)*Number(price));
  }, [quantity, price]);


  function handleQuantityChange(e) {
    let newQuantity = e.target.value;
    changeCartItemQuantity(productId, productType, newQuantity);
  }

  function handleRemoveItem() {
    removeFromCart(productId, productType);
  }

  return (
    <div className={styles.cartItem} data-id={`${productType}-${productId}`} data-testid='cartItem'>
      <div className={styles.topPart}>
        <NavLink to={`/products/${productType}/${productId}`} onClick={handleNavLinkClick}>
          <img src={productImage} alt="" />
        </NavLink>
        <div className={styles.titleAndPrice}>
          <NavLink to={`/products/${productType}/${productId}`} onClick={handleNavLinkClick}>
            <p className={styles.productTitle} data-testid='productTitle'>{productTitle}</p>
          </NavLink>
          <p className={styles.totalPrice}>${totalPrice}</p>
        </div>
      </div>
      <div className={styles.bottomPart}>
        <p className={styles.quantity}>Quantity: &nbsp;
          <select onChange={handleQuantityChange} value={quantity}>
            {Array.from({ length: 3 }, (_, index) => (
              <option key={index}>{index + 1}</option>
            ))}
          </select>
        </p>
        <button className={styles.removeButton} onClick={handleRemoveItem}>Remove</button>
      </div>
    </div>
  )
}

export default CartItem;
