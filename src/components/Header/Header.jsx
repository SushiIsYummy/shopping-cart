import './Header.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { 
  Form,
  NavLink,
} from "react-router-dom";
function Header() {
  const [searchInput, setSearchInput] = useState('');
  
  return (
    <>
      <header>
        <nav>
          <NavLink to={'/'}>
            <h1 className='store-name'>AnimeStore</h1>
          </NavLink>
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
        <Form>
          <button type='submit'>
            <i className='fa fa-solid fa-search'></i>
          </button>
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} spellCheck='false'/>
          
          <div className="reset-button-container">
            <button type='button' className='reset' onClick={() => setSearchInput('')}>
              <i className="fa fa-solid fa-times"></i>
            </button>
          </div>

        </Form>
      </header>
    </>
  )
}

export default Header;
