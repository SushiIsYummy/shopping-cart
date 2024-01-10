import { 
  useEffect, 
  useState, 
} from 'react'
import { useMediaQuery } from '@react-hook/media-query';
import styles from './Shop.module.css';
import { 
  NavLink,
  useSearchParams,
  useNavigate,
  useNavigation,
  useLocation,
  useLoaderData,
} from 'react-router-dom';
import generateFakePrice from '../../utils/generateFakePrice';
import StarRating from '../../components/StarRating/StarRating';
import Pagination from '../../components/Pagination/Pagination';
import Filter from '../../components/Filter/Filter';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import { addToCart } from '../../cartItemsLocalStorage';
import { AddToCartModals } from '../../components/AddToCartModal/AddToCartModal';
import { useMiniCart } from '../MiniCart/MiniCartContext';
import addUrlParam from '../../utils/addUrlParam';

function Shop() {
  const { loaderGenresData, loaderProductsData, loaderShowFilters1, loaderShowFilters2 } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [modals, setModals] = useState([]);
  const [productsData, setProductsData] = useState(loaderProductsData);
  const [genresData, setGenresData] = useState(loaderGenresData);
  // const [showFilters1, setShowFilters1] = useState(loaderShowFilters1);
  const [showFilters1, setShowFilters1] = useState(false);
  const [showFilters2, setShowFilters2] = useState(loaderShowFilters2);
  const [documentHeightGreaterThan100vh, setDocumentHeightGreaterThan100vh] = useState(true);
  const [rerender, setRerender] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const navigation = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = navigate.state === 'loading';

  let hasProducts = productsData?.data?.length > 0;
  let urlParam = new URLSearchParams(window.location.search);

  let productTypeParam = urlParam.get('productType');
  let searchInputParam = urlParam.get('search');
  let sortByParam = urlParam.get('sortBy');
  let pageParam = urlParam.get('page');
  // console.log(pageParam);
  // console.log(sortByParam);
  // console.log(productTypeParam);
  // let genresParam = searchParams.get('genres');
  // let minScoreParam = searchParams.get('minScore');
  // let maxScoreParam = searchParams.get('maxScore');
  // let filterParams = getFilterParams();

  const totalPages = productsData?.pagination?.last_visible_page ?? 0;
  const totalItems = productsData?.pagination?.items?.total ?? 0;
  const itemsPerPage = productsData?.pagination?.items?.per_page ?? 0;
  const paginationStartIndex = (pageParam - 1) * itemsPerPage + 1;
  const paginationEndIndex = Math.min(pageParam * itemsPerPage, totalItems);
  console.log('shop RENDERED!');
  useEffect(() => {
    let changed = false;
    if (!pageParam) {
      addUrlParam('page', '1');
      changed = true;
    }
    if (!sortByParam) {
      addUrlParam('sortBy', 'popularity');
      changed = true;
    }
    if (!pageParam) {
      addUrlParam('productType', 'anime');
      changed = true;
    }
    // addUrlParam('showFilters1', 'false');
    // addUrlParam('showFilters2', 'true');
    if (changed) {
      setRerender(!rerender);
    }
    // console.log(pageParam);
    // console.log(sortByParam);
    // console.log(productTypeParam);
  }, [pageParam, productTypeParam, rerender, searchParams, sortByParam])

  useEffect(() => {
    if (loaderProductsData) {
      setProductsData(loaderProductsData);
    }
  }, [loaderProductsData])

  useEffect(() => {
    if (loaderGenresData) {
      setGenresData(loaderGenresData);
    }
  }, [loaderGenresData])

  useEffect(() => {
    // setShowFilters1(loaderShowFilters1);
    addUrlParam('showFilters1', loaderShowFilters1);
    console.log('show filters1 changed');
  }, [loaderShowFilters1]);
  
  useEffect(() => {
    setShowFilters2(loaderShowFilters2);
    addUrlParam('showFilters2', loaderShowFilters2);
    console.log('show filters2 changed');
  }, [loaderShowFilters2]);

  useEffect(() => {
    
    console.log('shop component mounted');
    return () => {
      console.log('shop component unmounted');
      sessionStorage.removeItem('useLoader', 'false');
    }
  }, [])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const viewportHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      setDocumentHeightGreaterThan100vh(documentHeight > viewportHeight);
    });

    resizeObserver.observe(document.documentElement);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  function handlePageChange(pageNumber) {
    sessionStorage.setItem('useLoader', JSON.stringify(['products']));
    setSearchParams((searchParams) => {
      const updatedSearchParams = new URLSearchParams(searchParams);
      updatedSearchParams.set('page', pageNumber.toString());
      return updatedSearchParams;
    })
  }

  function addModal(success) {
    let modalId = crypto.randomUUID();
    setModals((prevModals) => [...prevModals, 
      { 
        message: success ? 'Product added to cart' : 'Max 3 quantity allowed per product', 
        success: success ? true : false,
        id: modalId,
      }])
  }

  return (
    <>
      <div className={styles.shop}>
        {isSmallScreen &&
        <p className={styles.back} onClick={() => { 
          navigate(-1) 
        }}>
          <i className='fa fa-2xs fa-solid fa-arrow-left'></i>
          Back
        </p>}
        <div className={styles.sortAndFilter}>
          <div className={styles.topBlock}>
            {!isSmallScreen &&
            <div className={styles.backContainer}>
              <p className={styles.back} onClick={() => { 
                navigate(-1) 
              }}>
                <i className='fa fa-2xs fa-solid fa-arrow-left'></i>
                Back
              </p>
            </div>}
            <div className={styles.buttonAndSelect}>
              {isSmallScreen && 
              <button 
                type='button' 
                className={styles.filter} 
                onClick={() => {
                  addUrlParam('showFilters1', !showFilters1);
                  setShowFilters1(!showFilters1);
                }}
              >
                {`${showFilters1 ? 'Hide' : 'Show'} Filters`}
              </button>}
              {!isSmallScreen && 
              <button 
              type='button' 
              className={styles.filter} 
              onClick={() => {
                addUrlParam('showFilters2', !showFilters2);
                setShowFilters2(!showFilters2);
                }}
              >
                {`${showFilters2 ? 'Hide' : 'Show'} Filters`}
              </button>}
              <div className={styles.sortByContainer}>
                <p>Sort by &nbsp;</p>
                <select 
                  className={styles.sortBsy}
                  value={sortByParam ? sortByParam : 'popularity'}
                  onChange={(e) => {
                    sessionStorage.setItem('useLoader', JSON.stringify(['products']));
                    setSearchParams((searchParams) => {
                      const updatedSearchParams = new URLSearchParams(searchParams);
                      updatedSearchParams.set('page', '1');
                      updatedSearchParams.set('sortBy', e.target.value);
                      return updatedSearchParams;
                    })
                  }}>
                  <option value="popularity">Popularity</option>
                  <option value="AZ">Name: A-Z</option>
                  <option value="ZA">Name: Z-A</option>
                  <option value="newest">Newest to Oldest</option>
                  <option value="oldest">Oldest to Newest</option>
                </select>
              </div>
            </div>
          </div>
          {showFilters1 && isSmallScreen &&
          <Filter 
            genresData={genresData ? genresData.data : []} 
          />}
        </div>
        <div className={styles.paginationInfo}>
          {productsData && !isLoading && !searchInputParam && <p>Displaying results for all {productTypeParam}</p>}
          {productsData && !isLoading && searchInputParam && <p>Displaying results for "{searchInputParam}" for all {productTypeParam}</p>}
          {productsData && !isLoading && hasProducts && `Showing ${paginationStartIndex}-${paginationEndIndex} of ${totalItems} Total Products`}
          {productsData && !isLoading && !(hasProducts) &&  `No Products Found.`}
          {/* {isLoading && 'Loading Products...'} */}
          {/* {isLoading && <LoadingOverlay />} */}
        </div>
        <div className={styles.filterAndItems}>
          {showFilters2 && !isSmallScreen &&
          <Filter 
            genresData={genresData ? genresData.data : []} 
          />}
          <div className={styles.items} data-testid='items'>
            {productsData && productsData?.data?.map((product, index) => {
              let ratingOutOfFive;
              if (Math.round(product.score*100) % 2 === 0) {
                ratingOutOfFive = product.score / 2;
              } else {
                ratingOutOfFive = Number(+(Math.round(Math.floor(product.score/2 * 100) / 100 + "e+2")  + "e-2")).toFixed(2);
              }
              return (
                // sometimes the api response has 2+ items with the same 'mal_id'
                <ShopItem 
                  key={index} 
                  productType={productTypeParam} 
                  productData={product} 
                  ratingOutOfFive={ratingOutOfFive}
                  addModal={addModal}
                />
              )
            })}
          </div>
        </div>
        <AddToCartModals modals={modals} setModals={setModals}></AddToCartModals>
        {hasProducts && totalPages > 1 &&
          <Pagination 
            totalPages={totalPages} 
            currentPage={Number(pageParam)} 
            onPageChange={handlePageChange}
            customStyles={styles}
          />}
      </div>
      {hasProducts && documentHeightGreaterThan100vh &&
        <div className={styles.backToTop} onClick={() => window.scrollTo({ top: 0})}>Back to top</div>
      }
    </>
  )
}

function ShopItem({
  productType,
  productData,
  ratingOutOfFive,
  addModal,
}) {
  const [itemQuantity, setItemQuantity] = useState(1);
  const { cartIsOpen, openMiniCart, closeMiniCart, miniCartItems, scrollToMiniCartItem } = useMiniCart();
  const productId = productData.mal_id;
  const productImage = productData.images.jpg.large_image_url;
  const productTitle = productData?.title_english || productData.title;
  const fakePrice = generateFakePrice(productTitle);

  function handleAddToCartClick() {
    let newItem = {};
    newItem['quantity'] = itemQuantity;
    newItem['productId'] = productId;
    newItem['productType'] = productType;
    newItem['productImage'] = productImage;
    newItem['productTitle'] = productTitle;
    newItem['price'] = fakePrice;
    let addedToCart = addToCart(newItem);
    addModal(addedToCart);
    openMiniCart();
    scrollToMiniCartItem(productType, productId);
  }

  function handleQuantityChange(e) {
    let newQuantity = e.target.value;
    setItemQuantity(newQuantity);
  }

  return (
    <div className={styles.itemInfoContainer}>
      <div className={styles.itemInfo} data-testid='itemInfo'>
        <NavLink 
          to={`/products/${productType}/${productId}`} 
        >
          <img src={productImage} alt="" />
        </NavLink>
        <NavLink 
          to={`/products/${productType}/${productId}`}
        >
          <p className={styles.itemTitle}>{productTitle}</p>
        </NavLink>
        <div className={styles.starRatingContainer}>
          <p className={styles.ratingDecimal}>{ratingOutOfFive}</p>
          <StarRating rating={ratingOutOfFive}></StarRating>
          <p className={styles.reviews}>({productData.scored_by})</p>
        </div>
        <div className={styles.priceAndQuantity}>
          <p className={styles.price}>${fakePrice}</p>
          <p className={styles.quantity}>Quantity: &nbsp;
            <select onChange={handleQuantityChange} value={itemQuantity}>
              {Array.from({ length: 3 }, (_, index) => (
                <option key={index}>{index + 1}</option>
              ))}
            </select>
          </p>
        </div>
        <button 
          className={styles.addToCart}
          onClick={handleAddToCartClick}
          data-testid='addToCartButton'
        >
          ADD TO CART
        </button>
      </div>
    </div>
  )
}

export default Shop;
