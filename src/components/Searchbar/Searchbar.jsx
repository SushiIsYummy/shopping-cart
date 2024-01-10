import styles from './Searchbar.module.css';
import { capitalize } from 'lodash';
import { useRef, useState } from 'react';
import { 
  Form,
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";

function Searchbar({
  searchInput,
  setSearchInput,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const productsList = ['anime', 'manga'];
  const productType = searchParams.get('productType');
  const [selectedProduct, setSelectedProduct] = useState(productType || productsList[0]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchbar = useRef();

  function handleDropdownChange(e) {
    setSelectedProduct(e.target.value);
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    let updatedSearchParams = new URLSearchParams();
    updatedSearchParams.set('search', searchbar.current.value);
    updatedSearchParams.set('productType', selectedProduct);
    updatedSearchParams.set('searchId', crypto.randomUUID());

    if (location.pathname !== '/shop') {
      navigate(`/shop?page=1&sortBy=popularity&${updatedSearchParams}`);
    } else {
      setSearchParams((searchParams) => {
      // console.log(searchParams.toString());
        return { 
          ...Object.fromEntries(searchParams),
          search: searchbar.current.value,
          productType: selectedProduct,
          // make it so that even when searching with the same exact inputs,
          // it will still fetch products data.
          searchId: crypto.randomUUID(),
        };
      })
    }
  }

  return (
    <Form className={styles.searchbar} onSubmit={handleSubmit}>
      {productsList &&
      <select name='productType' value={selectedProduct} onChange={handleDropdownChange}>
        {productsList.map((product) => 
          <option key={product} value={product}>{capitalize(product)}</option>
        )}
      </select>}
      <div className={styles.searchInputContainer}>
        <input 
          className={styles.searchInput} 
          ref={searchbar}
          type='text' 
          name='search' 
          value={searchInput} 
          onChange={(e) => setSearchInput(e.target.value)} 
          spellCheck='false'
          placeholder={`Search ${selectedProduct}...`}
        />
        {searchInput !== '' &&
        <div className={styles.resetButtonContainer}>
          <button className={styles.resetButton} type='button' onClick={() => setSearchInput('')}>
            <i className="fa fa-solid fa-times"></i>
          </button>
        </div>}
      </div>
      <button className={styles.submitButton} type='submit'>
        <i className='fa fa-solid fa-search'></i>
      </button>
    </Form>
  )
}

export default Searchbar;
