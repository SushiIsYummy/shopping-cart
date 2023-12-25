import styles from './Header.module.css';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { 
  Outlet,
  NavLink,
} from "react-router-dom";
import Searchbar from '../Searchbar/Searchbar';
import { useMediaQuery } from '@react-hook/media-query';
import { getTotalItemsInCart } from '../../cartItemsLocalStorage';

function Header() {
  const [searchInput, setSearchInput] = useState('');
  const [totalItems, setTotalItems] = useState(getTotalItemsInCart());
  const outsideNav = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const handleCartItemsChange = () => {
      setTotalItems(getTotalItemsInCart());
    };

    window.addEventListener('cartItemsChanged', handleCartItemsChange);

    return () => {
      window.removeEventListener('cartItemsChanged', handleCartItemsChange);
    };
  }, []);

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.headerNav}>
          <NavLink to={'/'}>
            <h1 className={styles.storeName}>AnimeStore</h1>
          </NavLink>
          {!outsideNav && 
          <Searchbar searchInput={searchInput} setSearchInput={setSearchInput}/>}
          <div className={styles.mainNav}>
            <NavLink className={styles.logo} to={`/`}>
              Home
            </NavLink>
            <NavLink to={`/shop`}>
              Shop
            </NavLink>
            <NavLink to={`/cart`}>
              <div className={styles.cartIconContainer}>
                <FontAwesomeIcon className={styles.shoppingCart} icon={faShoppingCart}></FontAwesomeIcon>
                {totalItems > 0 &&
                <span>
                  <p>
                    {totalItems}
                  </p>
                </span>}
              </div>
            </NavLink>
          </div>
        </nav>
        {outsideNav && <Searchbar customStyles={styles} searchInput={searchInput} setSearchInput={setSearchInput}/>}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Header;
