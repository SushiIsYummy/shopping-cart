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
import MiniCart from '../../pages/MiniCart/MiniCart';

function Header() {
  const [searchInput, setSearchInput] = useState('');
  const [totalItems, setTotalItems] = useState(getTotalItemsInCart());
  const [miniCartIsOpen, setMiniCartIsOpen] = useState(false);
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

  function handleCartClick() {
    setMiniCartIsOpen(!miniCartIsOpen);
  }

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
            <div className={styles.cartIconContainer} onClick={handleCartClick}>
              <FontAwesomeIcon className={styles.shoppingCart} icon={faShoppingCart}></FontAwesomeIcon>
              {totalItems > 0 &&
              <span>
                <p onClick={handleCartClick}>
                  {totalItems}
                </p>
              </span>}
            </div>
          </div>
        </nav>
        {outsideNav && <Searchbar customStyles={styles} searchInput={searchInput} setSearchInput={setSearchInput}/>}
      </header>
      <main>
        <Outlet />
      </main>
      <MiniCart isOpen={miniCartIsOpen} setMiniCartIsOpen={setMiniCartIsOpen}/>
    </>
  )
}

export default Header;
