import { 
  useEffect, 
  useState, 
} from 'react'
import { useMediaQuery } from '@react-hook/media-query';
import styles from './Shop.module.css';
import { getAnimeGenres, getMangaGenres, getNewestAnimeInfo, getNewestMangaInfo, getOldestAnimeInfo, getOldestMangaInfo, getPopularAnimeInfo, getPopularMangaInfo, getSortedAZAnimeInfo, getSortedAZMangaInfo, getSortedZAAnimeInfo, getSortedZAMangaInfo } from '../../api';
import { 
  NavLink,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import generateFakePrice from '../../utils/generateFakePrice';
import StarRating from '../../components/StarRating/StarRating';
import Pagination from '../../components/Pagination/Pagination';
import Filter from '../../components/Filter/Filter';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import { addToCart } from '../../cartItemsLocalStorage';
import { AddToCartModals } from '../../components/AddToCartModal/AddToCartModal';
import { useMiniCart } from '../MiniCart/MiniCartContext';
// export async function loader() {
//   const popularAnime = await getPopularAnimeInfo();
//   console.log(popularAnime);
//   return { popularAnime };
// }

function Shop() {
  // const { popularAnime } = useLoaderData();
  const [modals, setModals] = useState([]);
  const [productsData, setProductsData] = useState(null);
  const [genresData, setGenresData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadingProductsData, setIsLoadingProductsData] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const { cartIsOpen, openMiniCart, closeMiniCart } = useMiniCart();
  let hasProducts = productsData?.data?.length > 0;

  // url search params
  let sortByParam = searchParams.get('sortBy');
  let productTypeParam = searchParams.get('productType');
  let pageParam = searchParams.get('page');
  let genresParam = searchParams.get('genres');
  let minScoreParam = searchParams.get('minScore');
  let maxScoreParam = searchParams.get('maxScore');
  let filterParams = getFilterParams();

  const totalPages = productsData?.pagination?.last_visible_page ?? 0;
  const totalItems = productsData?.pagination?.items?.total ?? 0;
  const itemsPerPage = productsData?.pagination?.items?.per_page ?? 0;
  const paginationStartIndex = (pageParam - 1) * itemsPerPage + 1;
  const paginationEndIndex = Math.min(pageParam * itemsPerPage, totalItems);

  useEffect(() => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    let changed = false;
  
    if (!pageParam) {
      updatedSearchParams.set('page', '1');
      changed = true; 
    }
    if (!sortByParam) {
      updatedSearchParams.set('sortBy', 'popularity');
      changed = true; 
    }
    if (!productTypeParam) {
      updatedSearchParams.set('productType', 'anime');
      changed = true; 
    }
    if (changed) {
      setSearchParams(updatedSearchParams);
      console.log('SET DEFAULT PARAMS');
    }
  }, [searchParams, pageParam, sortByParam, productTypeParam, setSearchParams]);

  useEffect(() => {
    async function fetchGenresData() {
      let genresData = null;
      if (productTypeParam && productTypeParam === 'anime') {
        genresData = await getAnimeGenres();
        console.log('got anime genres')
      } else if (productTypeParam && productTypeParam === 'manga') {
        genresData = await getMangaGenres();
        console.log('got manga genres')
      }
      setGenresData(genresData);
    }

    console.log('ENTERING FETCH GENRES');
    console.log(`productType param: ${productTypeParam}`);
    
    if (productTypeParam) {
      // add timeout in development to prevent 429 too many requests
      // in react strictmode, the app calls api 4 times total on page refresh
      // api has a rate limit of 3 requests per second
      // setTimeout(() => {
        fetchGenresData();
      // }, 1000);
    }
    
    console.log('LEAVING FETCH GENRES');

  }, [productTypeParam]);

  useEffect(() => {
    async function fetchProductsData() {
      let updatedData = null;
      
      if (productTypeParam === 'anime') {
        if (sortByParam === 'popularity') {
          updatedData = await getPopularAnimeInfo(pageParam, filterParams);
        } else if (sortByParam === 'AZ') {
          updatedData = await getSortedAZAnimeInfo(pageParam, filterParams);
        } else if (sortByParam === 'ZA') {
          updatedData = await getSortedZAAnimeInfo(pageParam, filterParams);
        } else if (sortByParam === 'newest') {
          updatedData = await getNewestAnimeInfo(pageParam, filterParams)
        } else if (sortByParam === 'oldest') {
          updatedData = await getOldestAnimeInfo(pageParam, filterParams);
        }
        console.log('got anime info!');
      } else if (productTypeParam === 'manga') {
        if (sortByParam === 'popularity') {
          updatedData = await getPopularMangaInfo(pageParam, filterParams);
        } else if (sortByParam === 'AZ') {
          updatedData = await getSortedAZMangaInfo(pageParam, filterParams);
        } else if (sortByParam === 'ZA') {
          updatedData = await getSortedZAMangaInfo(pageParam, filterParams);
        } else if (sortByParam === 'newest') {
          updatedData = await getNewestMangaInfo(pageParam, filterParams)
        } else if (sortByParam === 'oldest') {
          updatedData = await getOldestMangaInfo(pageParam, filterParams);
        }
        console.log('got manga info!');
      }
      setProductsData(updatedData);
      setIsLoadingProductsData(false);
    }
    console.log('ENTERING FETCH PRODUCTS');

    if (pageParam && sortByParam && productTypeParam && !isLoadingProductsData) {
      // add timeout in development to prevent 429 too many requests
      // in react strictmode, the app calls api 4 times total on page refresh
      // api has a rate limit of 3 requests per second
      setIsLoadingProductsData(true);
      setTimeout(() => {
        fetchProductsData();
      }, 2000);
    }
    console.log('LEAVING FETCH PRODUCTS');

  }, [productTypeParam, pageParam, filterParams, sortByParam]);

  function getFilterParams() {
    let genreIds = [];
    if (genresParam && genresData) {
      genresData.data.forEach((genre) => {
        if (genresParam.includes(genre.name)) {
          genreIds.push(genre.mal_id);
        }
      });
    }
    
    let filterParams = '';
    if (genreIds.length > 0) {
      filterParams = filterParams.concat(`genres=${genreIds}`);
    }
    if (minScoreParam) {
      filterParams = filterParams.concat(`&min_score=${Math.round(minScoreParam*2 + "e+2")  + "e-2"}`);
    }
    if (maxScoreParam) {
      filterParams = filterParams.concat(`&max_score=${maxScoreParam*2}`);
    }

    return filterParams;
  }

  function handlePageChange(pageNumber) {
    console.log('CHANGED PAGE!');
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
      {isLoadingProductsData && <LoadingOverlay />}
      <div className={styles.shop}>
        {isSmallScreen &&
        <p className={styles.back} onClick={() => { navigate(-1) }}>
          <i className='fa fa-2xs fa-solid fa-arrow-left'></i>
          Back
        </p>}
        <div className={styles.sortAndFilter}>
          <div className={styles.topBlock}>
            {!isSmallScreen &&
            <p className={styles.back} onClick={() => { navigate(-1) }}>
              <i className='fa fa-2xs fa-solid fa-arrow-left'></i>
              Back
            </p>}
            <div className={styles.buttonAndSelect}>
              <button 
                type='button' 
                className={styles.filter} 
                onClick={() => setShowFilters(!showFilters)}
              >
                {`${showFilters ? 'Hide' : 'Show'} Filters`}
              </button>
              <div className={styles.sortByContainer}>
                <p>Sort by &nbsp;</p>
                <select 
                  className={styles.sortBsy}
                  value={sortByParam ? sortByParam : 'popularity'}
                  onChange={(e) => {
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
          {showFilters && isSmallScreen &&
          <Filter 
            genresData={genresData ? genresData.data : []} 
          />}
        </div>
        <p className={styles.paginationInfo}>
          {!isLoadingProductsData && hasProducts && `Showing ${paginationStartIndex}-${paginationEndIndex} of ${totalItems} Total Products`}
          {!isLoadingProductsData && !(hasProducts) &&  `No Products Found.`}
          {isLoadingProductsData && 'Loading Products...'}
        </p>
        <div className={styles.filterAndItems}>
          {showFilters && !isSmallScreen &&
          <Filter 
            genresData={genresData ? genresData.data : []} 
          />}
          <div className={styles.items}>
            {productsData && productsData?.data?.map((product, index) => {
              const ratingOutOfFive = Number(+(Math.round(Math.floor(product.score/2 * 100) / 100 + "e+2")  + "e-2")).toFixed(2);
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
            isLoading = {isLoadingProductsData}
          />}
      </div>
      {hasProducts && 
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
  // const [newItemAddedToCart, setNewItemAddedToCart] = useState(false);

  const { cartIsOpen, openMiniCart, closeMiniCart, miniCartItems, scrollToMiniCartItem } = useMiniCart();

  const productId = productData.mal_id;
  const productImage = productData.images.jpg.large_image_url;
  const productTitle = productData.title;
  const fakePrice = generateFakePrice(productTitle);
  
  // useEffect(() => {
  //   let childToScroll = null;

  //   if (miniCartItems?.current?.children) {
  //     childToScroll = Array.from(miniCartItems?.current?.children).find(
  //       (child) => child.getAttribute('data-id') === `${productTypeParam}-${productId}`
  //     );
  //   }

  //   if (newItemAddedToCart && childToScroll) {
  //     childToScroll.scrollIntoView({ block: 'nearest' });
  //     setNewItemAddedToCart(false);
  //   }
  // }, [newItemAddedToCart, miniCartItems, productId, productTypeParam]);

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
    console.log(miniCartItems.current)
  }

  function handleQuantityChange(e) {
    let newQuantity = e.target.value;
    setItemQuantity(newQuantity);
  }

  return (
    <div className={styles.itemInfoContainer}>
      <div className={styles.itemInfo}>
        <NavLink to={`/products/${productType}/${productId}`}>
          <img src={productImage} alt="" />
        </NavLink>
        <NavLink to={`/products/${productType}/${productId}`}>
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
        >
          ADD TO CART
        </button>
      </div>
    </div>
  )
}
export default Shop;
