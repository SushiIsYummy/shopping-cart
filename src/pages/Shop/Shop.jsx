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
} from 'react-router-dom';
import generateFakePrice from '../../utils/generateFakePrice';
import StarRating from '../../components/StarRating/StarRating';
import Pagination from '../../components/Pagination/Pagination';
import Filter from '../../components/Filter/Filter';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';

// export async function loader() {
//   const popularAnime = await getPopularAnimeInfo();
//   console.log(popularAnime);
//   return { popularAnime };
// }

function Shop() {
  // const { popularAnime } = useLoaderData();
  const options = ['popularity', 'AZ', 'ZA', 'newest', 'oldest'];
  const [productsData, setProductsData] = useState(null);
  const [genresData, setGenresData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

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
      setIsLoading(false);
    }
    console.log('ENTERING FETCH PRODUCTS');

    if (pageParam && sortByParam && productTypeParam && !isLoading) {
      // add timeout in development to prevent 429 too many requests
      // in react strictmode, the app calls api 4 times total on page refresh
      // api has a rate limit of 3 requests per second
      setIsLoading(true);
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
      filterParams = filterParams.concat(`&min_score=${Math.round(minScoreParam/2 + "e+2")  + "e-2"}`);
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

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div className={styles.shop}>
        <div className={styles.sortAndFilter}>
          <div className={styles.buttonAndSelect}>
            <button 
              type='button' 
              className={styles.filter} 
              onClick={() => setShowFilters(!showFilters)}
            >
              {`${showFilters ? 'Hide' : 'Show'} Filters`}
            </button>
            <div className={styles.sortByContainer}>
              Sort by &nbsp;
              <select className={styles.sortBsy}
                onChange={(e) => {
                  setSearchParams((searchParams) => {
                    const updatedSearchParams = new URLSearchParams(searchParams);
                    updatedSearchParams.set('page', '1');
                    updatedSearchParams.set('sortBy', options[Number(e.target.value)]);
                    return updatedSearchParams;
                  })
                }}>
                <option value="0" selected={sortByParam === 'popularity'}>Popularity</option>
                <option value="1" selected={sortByParam === 'AZ'}>Name: A-Z</option>
                <option value="2" selected={sortByParam === 'ZA'}>Name: Z-A</option>
                <option value="3" selected={sortByParam === 'newest'}>Newest to Oldest</option>
                <option value="4" selected={sortByParam === 'oldest'}>Oldest to Newest</option>
              </select>
            </div>
          </div>
          {showFilters && isSmallScreen &&
          <Filter 
            genresData={genresData ? genresData.data : []} 
          />}
        </div>
        <p className={styles.paginationInfo}>
          {productsData?.data?.length > 0 && `Showing ${paginationStartIndex}-${paginationEndIndex} of ${totalItems} Total Products`}
          {!(productsData?.data?.length > 0) &&  `No Products Found.`}
        </p>
        <div className={styles.filterAndItems}>
          {showFilters && !isSmallScreen &&
          <Filter 
            genresData={genresData ? genresData.data : []} 
          />}
          <div className={styles.items}>
            {productsData && productsData?.data?.map((product, index) => {
              const ratingOutOfFive = +(Math.round(Math.floor(product.score/2 * 100) / 100 + "e+2")  + "e-2")
              return (
                // sometimes the api response has 2+ items with the same 'mal_id'
                <div key={index} className={styles.itemInfoContainer}>
                  <div className={styles.itemInfo}>
                    <NavLink to={`/products/${productTypeParam}/${product.mal_id}`}>
                      <img src={product.images.jpg.large_image_url} alt="" />
                    </NavLink>
                    <NavLink to={`/products/${productTypeParam}/${product.mal_id}`}>
                      <p className={styles.itemTitle}>{product.title}</p>
                    </NavLink>
                    <div className={styles.starRatingContainer}>
                      <p className={styles.ratingDecimal}>{ratingOutOfFive}</p>
                      <StarRating rating={ratingOutOfFive}></StarRating>
                      <p className={styles.reviews}>({product.scored_by})</p>
                    </div>
                    <p className={styles.price}>${generateFakePrice(product.title)}</p>
                    <button className={styles.addToCart}>ADD TO CART</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {productsData?.data?.length > 0 && 
          <Pagination 
            totalPages={totalPages} 
            currentPage={Number(pageParam)} 
            onPageChange={handlePageChange}
          />}
        {productsData?.data?.length > 0 && 
          <div className={styles.backToTop} onClick={() => window.scrollTo({ top: 0})}>Back to top</div>
        }
      </div>
    </>
  )
}

export default Shop;
