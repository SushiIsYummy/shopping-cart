import './Header.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { 
  Form,
  Outlet,
  NavLink,
} from "react-router-dom";
import Searchbar from '../Searchbar/Searchbar';
import { useMediaQuery } from '@react-hook/media-query';

function Header() {
  const [searchInput, setSearchInput] = useState('');
  const outsideNav = useMediaQuery('(max-width: 768px)');
  return (
    <>
      <header>
        <nav>
          <NavLink to={'/'}>
            <h1 className='store-name'>AnimeStore</h1>
          </NavLink>
          {!outsideNav && 
          <Searchbar searchInput={searchInput} setSearchInput={setSearchInput}/>}
          <div className="main-nav">
            <NavLink to={`/`}>
              Home
            </NavLink>
            <NavLink to={`/shop`}>
              Shop
            </NavLink>
            <NavLink to={`/cart`}>
              <FontAwesomeIcon className='shopping-cart' icon={faShoppingCart}></FontAwesomeIcon>
            </NavLink>
          </div>
        </nav>
        {outsideNav && <Searchbar searchInput={searchInput} setSearchInput={setSearchInput}/>}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Header;
