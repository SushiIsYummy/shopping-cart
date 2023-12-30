import styles from './Header.module.css';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { 
  Outlet,
  NavLink,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import Searchbar from '../Searchbar/Searchbar';
import { useMediaQuery } from '@react-hook/media-query';
import { getTotalItemsInCart } from '../../cartItemsLocalStorage';
import MiniCart from '../../pages/MiniCart/MiniCart';
import { useMiniCart } from '../../pages/MiniCart/MiniCartContext';
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay';

function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputParam = searchParams.get('search');
  const [searchInput, setSearchInput] = useState(searchInputParam || '');
  const [totalItems, setTotalItems] = useState(getTotalItemsInCart());
  const outsideNav = useMediaQuery('(max-width: 768px)');
  const { cartIsOpen, openMiniCart, closeMiniCart } = useMiniCart();
  const navigation = useNavigation();

  useEffect(() => {
    const handleCartItemsChange = () => {
      setTotalItems(getTotalItemsInCart());
    };

    window.addEventListener('cartItemsChanged', handleCartItemsChange);

    return () => {
      window.removeEventListener('cartItemsChanged', handleCartItemsChange);
    };
  }, []);

  useEffect(() => {
    if (navigation.state === 'loading') {
      setSearchInput('');
    }
  }, [navigation.state])

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.headerNav}>
          <NavLink to={'/'}>
            <h1 className={styles.storeName}>AnimeStore</h1>
          </NavLink>
          {!outsideNav && 
          <Searchbar searchInput={searchInput} setSearchInput={setSearchInput} productsList={['anime', 'manga']}/>}
          <div className={styles.mainNav}>
            <NavLink className={styles.logo} to={`/`}>
              Home
            </NavLink>
            <NavLink to={`/shop`} onClick={() => setSearchInput('')}>
              Shop
            </NavLink>
            <div className={styles.cartIconContainer} onClick={() => openMiniCart()}>
              <FontAwesomeIcon className={styles.shoppingCart} icon={faShoppingCart}></FontAwesomeIcon>
              {totalItems > 0 &&
              <span>
                <p onClick={() => openMiniCart()}>
                  {totalItems}
                </p>
              </span>}
            </div>
          </div>
        </nav>
        {outsideNav && (
          <Searchbar 
            customStyles={styles} 
            searchInput={searchInput} 
            setSearchInput={setSearchInput} 
          />
        )}
      </header>
      <main>
        {navigation.state === 'loading' && <LoadingOverlay />}
        <Outlet />
      </main>
    </>
  )
}

export default Header;
