import { 
  useEffect, 
  useState, 
  useRef,
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
import ErrorPage from '../Error/ErrorPage';

function Shop() {
  const [modals, setModals] = useState([]);
  const [productsData, setProductsData] = useState(null);
  const [genresData, setGenresData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadingProductsData, setIsLoadingProductsData] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(false);
  const [documentHeightGreaterThan100vh, setDocumentHeightGreaterThan100vh] = useState(true);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  let backToTopRef = useRef();
  let backToTopCloneRef = useRef();
  const navigate = useNavigate();
  let hasProducts = productsData?.data?.length > 0;

  // url search params
  let searchInputParam = searchParams.get('search');
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
      // console.log('SET DEFAULT PARAMS');
    }
  }, [searchParams, pageParam, sortByParam, productTypeParam, setSearchParams]);

  useEffect(() => {
    async function fetchGenresData() {
      try {
        let refetch = false;
        let genresData = null;
        do {
          if (refetch) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          if (productTypeParam && productTypeParam === 'anime') {
            genresData = await getAnimeGenres();
            // console.log('got anime genres');
          } else if (productTypeParam && productTypeParam === 'manga') {
            genresData = await getMangaGenres();
            // console.log('got manga genres');
          }
          refetch = true;
          // fetch data again if there is a 429 error
        } while (genresData && genresData?.status === '429');
        // console.log(genresData);
        setGenresData(genresData);
      } catch (error) {
        console.log(error);
        throw new Response("", {
          status: 429,
          statusText: "RateLimitException",
        });
      }
    } 

    // console.log('ENTERING FETCH GENRES');
    // console.log(`productType param: ${productTypeParam}`);
    
    if (productTypeParam) {
      fetchGenresData();
    }
    
    // console.log('LEAVING FETCH GENRES');

  }, [productTypeParam]);
  
  useEffect(() => {
    async function fetchProductsData() {
      let updatedData = null; 
      let refetch = false;
      try {
        do {
          if (refetch) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          // console.log(`filter param: ${filterParams}`)
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
            // console.log('got anime info!');
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
            // console.log('got manga info!');
          }
          refetch = true;
          // fetch data again if there is a 429 error
        } while (updatedData && updatedData?.status === '429');

        setProductsData(updatedData);
        setIsLoadingProductsData(false);
      } catch (error) {
        setError(true);
      }
    }
    // console.log('ENTERING FETCH PRODUCTS');

    if (!genresData) {
      return;
    }
    
    if (pageParam && sortByParam && productTypeParam && !isLoadingProductsData) {
      setIsLoadingProductsData(true);
      // setTimeout(() => {
      fetchProductsData();
      // }, 2000);
    }
    // console.log('LEAVING FETCH PRODUCTS');

  }, [searchParams, productTypeParam, pageParam, filterParams, sortByParam, genresData]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      // console.log('HANDLED RESIZE');
      const viewportHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      
      if (backToTopCloneRef.current) {
        // console.log(backToTopCloneRef.current);
        // console.log(getHeightOfElement(backToTopCloneRef.current));
        const backToTopStyles = getComputedStyle(backToTopCloneRef.current);
        const elementHeight = backToTopCloneRef.current?.clientHeight || 0;
        const elementMarginTop = backToTopStyles.marginTop;
        // console.log(`element height: ${elementHeight}`);
        // console.log(`element margin: ${backToTopStyles.marginTop}`);
        // console.log(documentHeightGreaterThan100vh);
        // console.log(documentHeight);
        // console.log(viewportHeight)
        setDocumentHeightGreaterThan100vh(documentHeight > viewportHeight);
      }
    });

    const handleResize = () => {
      // console.log('HANDLED RESIZE');
      const viewportHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      
      if (backToTopCloneRef.current) {
        // console.log(backToTopCloneRef.current);
        // console.log(getHeightOfElement(backToTopCloneRef.current));
        const backToTopStyles = getComputedStyle(backToTopCloneRef.current);
        const elementHeight = backToTopCloneRef.current?.clientHeight || 0;
        const elementMarginTop = backToTopStyles.marginTop;
        // console.log(`element height: ${elementHeight}`);
        // console.log(`element margin: ${backToTopStyles.marginTop}`);
        // console.log(documentHeightGreaterThan100vh);
        // console.log(documentHeight);
        // console.log(viewportHeight)
        setDocumentHeightGreaterThan100vh(documentHeight > viewportHeight);
      }
    };
    resizeObserver.observe(document.documentElement);
    // console.log('exists')
    // Initial check
    // handleResize();

    // const observer = new MutationObserver(handleResize);

    // Observe changes in the entire document
    // observer.observe(document, { subtree: true, childList: true });

    // Listen for resize events
    
    // window.addEventListener('resize', () => console.log('resized'));
    
    // Cleanup the event listener on component unmount
    return () => {
      // window.removeEventListener('resize', () => console.log('resized'));
      // observer.disconnect();
    };
  }, []);
  
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
    if (searchInputParam && searchInputParam !== '') {
      filterParams = filterParams.concat(`q=${searchInputParam}&`);
    }
    if (genreIds.length > 0) {
      filterParams = filterParams.concat(`genres=${genreIds}&`);
    }
    if (minScoreParam) {
      filterParams = filterParams.concat(`min_score=${Math.round(minScoreParam*2 + "e+2")  + "e-2"}&`);
    }
    if (maxScoreParam) {
      filterParams = filterParams.concat(`max_score=${maxScoreParam*2}&`);
    }

    return filterParams;
  }

  function handlePageChange(pageNumber) {
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

  if (error) {
    return <ErrorPage />;
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
            <div className={styles.backContainer}>
              <p className={styles.back} onClick={() => { navigate(-1) }}>
                <i className='fa fa-2xs fa-solid fa-arrow-left'></i>
                Back
              </p>
            </div>}
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
        <div className={styles.paginationInfo}>
          {!isLoadingProductsData && !searchInputParam && <p>Displaying results for all {productTypeParam}</p>}
          {!isLoadingProductsData && searchInputParam && <p>Displaying results for "{searchInputParam}" for all {productTypeParam}</p>}
          {!isLoadingProductsData && hasProducts && `Showing ${paginationStartIndex}-${paginationEndIndex} of ${totalItems} Total Products`}
          {!isLoadingProductsData && !(hasProducts) &&  `No Products Found.`}
          {isLoadingProductsData && 'Loading Products...'}
        </div>
        <div className={styles.filterAndItems}>
          {showFilters && !isSmallScreen &&
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
            isLoading = {isLoadingProductsData}
          />}
      </div>
      {hasProducts && documentHeightGreaterThan100vh &&
        <div ref={backToTopRef} className={styles.backToTop} onClick={() => window.scrollTo({ top: 0})}>Back to top</div>
      }
      <div ref={backToTopCloneRef} style={{ position: 'fixed', visibility: 'hidden' }} className={styles.backToTop} onClick={() => window.scrollTo({ top: 0})}>Back to top</div>
    </>
  )
}

function getHeightOfElement(element) {
  // Create a detached DOM node
  const tempNode = document.createElement('div');

  // Apply styles to the detached node (optional)
  tempNode.style.position = 'absolute';
  tempNode.style.visibility = 'hidden';

  // Clone the target element (to avoid modifying the original)
  const clonedElement = element.cloneNode(true);

  // Append the cloned element to the detached node
  tempNode.appendChild(clonedElement);

  // Append the detached node to the body (to make it part of the DOM)
  document.body.appendChild(tempNode);

  // Get the height of the cloned element
  const height = clonedElement.clientHeight;

  // Remove the detached node from the DOM
  document.body.removeChild(tempNode);

  return height;
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
          data-testid='addToCartButton'
        >
          ADD TO CART
        </button>
      </div>
    </div>
  )
}

export default Shop;
