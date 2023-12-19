import { 
  useEffect, 
  useState, 
} from 'react'
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

// export async function loader() {
//   const popularAnime = await getPopularAnimeInfo();
//   console.log(popularAnime);
//   return { popularAnime };
// }

function Shop() {
  // const { popularAnime } = useLoaderData();
  const options = ['popularity', 'AZ', 'ZA', 'newest', 'oldest'];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [prevSelectedOption, setPrevSelectedOption] = useState(null);
  const [productsData, setProductsData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productType, setProductType] = useState(null);
  const [genresData, setGenresData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const totalPages = productsData?.pagination?.last_visible_page ?? 0;
  const totalItems = productsData?.pagination?.items?.total ?? 0;
  const itemsPerPage = productsData?.pagination?.items?.per_page ?? 0;
  const paginationStartIndex = (currentPage - 1) * itemsPerPage + 1;
  const paginationEndIndex = Math.min(currentPage * itemsPerPage, totalItems);

  let productTypeParam = searchParams.get('productType');
  let genresParam = searchParams.get('genres');
  
  // default product is 'anime'
  useEffect(() => {
    if (!productTypeParam) {
      setProductType('anime');
      setSearchParams((searchParams) => ({ ...Object.fromEntries(searchParams), productType: 'anime' }));
    }
    if (!productType && productTypeParam) {
      setProductType(productTypeParam);
    }

  }, [productType, productTypeParam, setSearchParams]);

  useEffect(() => {
    async function fetchGenresData() {
      let genresData = null;
      if (productType && productType === 'anime') {
        genresData = await getAnimeGenres();
        // console.log('got anime genres')
      } else if (productType && productType === 'manga') {
        genresData = await getMangaGenres();
        // console.log('got manga genres')
      }
      setGenresData(genresData);
    }
    console.log(`genres param: ${genresParam}`);
    console.log(`productType: ${productType}`);
    console.log(`productTypeParam: ${productTypeParam}`);
    if (productType) {
      console.log('FETCHED GENRES DATA!');
      fetchGenresData();
    }
  }, [productType, productTypeParam, genresParam]);

  useEffect(() => {
    
    async function fetchProductsData() {
      let updatedData = null;
      let genreIds = [];
      if (genresParam && genresData) {
        genresData.data.map((genre) => {
          if (genresParam.includes(genre.name)) {
            genreIds.push(genre.mal_id);
          }
        })
      }
      let filterParams = `genres=${genreIds}`;
      let minScoreParam = searchParams.get('minScore');
      let maxScoreParam = searchParams.get('maxScore');

      if (minScoreParam) {
        filterParams = filterParams.concat(`&min_score=${minScoreParam*2}`);
      }
      if (maxScoreParam) {
        filterParams = filterParams.concat(`&max_score=${maxScoreParam*2}`);
      }

      if (productType === 'anime') {
        if (selectedOption === 'popularity') {
          updatedData = await getPopularAnimeInfo(currentPage, filterParams);
        } else if (selectedOption === 'AZ') {
          updatedData = await getSortedAZAnimeInfo(currentPage, filterParams);
        } else if (selectedOption === 'ZA') {
          updatedData = await getSortedZAAnimeInfo(currentPage, filterParams);
        } else if (selectedOption === 'newest') {
          updatedData = await getNewestAnimeInfo(currentPage, filterParams)
        } else if (selectedOption === 'oldest') {
          updatedData = await getOldestAnimeInfo(currentPage, filterParams);
        }
      } else if (productType === 'manga') {
        if (selectedOption === 'popularity') {
          updatedData = await getPopularMangaInfo(currentPage, filterParams);
        } else if (selectedOption === 'AZ') {
          updatedData = await getSortedAZMangaInfo(currentPage, filterParams);
        } else if (selectedOption === 'ZA') {
          updatedData = await getSortedZAMangaInfo(currentPage, filterParams);
        } else if (selectedOption === 'newest') {
          updatedData = await getNewestMangaInfo(currentPage, filterParams)
        } else if (selectedOption === 'oldest') {
          updatedData = await getOldestMangaInfo(currentPage, filterParams);
        }
      }
      setProductsData(updatedData);
    }
    if (selectedOption !== prevSelectedOption) {
      setCurrentPage(1);
      setPrevSelectedOption(selectedOption);
    } else {
      if (genresData) {
        fetchProductsData();
        console.log('FETCHED PRODUCTS DATA!');
      }
    }
  }, [selectedOption, currentPage, prevSelectedOption, productType, genresData, genresParam, searchParams]);

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }

  return (
    <div className={styles.shop}>
      {showFilters &&
      <Filter 
        genreData={genresData ? genresData.data : []} 
        setProductType={setProductType}
      />}
      <div className={styles.sortAndFilter}>
        <button 
          type='button' 
          className={styles.filter} 
          onClick={() => setShowFilters(!showFilters)}
        >
          {`${showFilters ? 'Hide' : 'Show'} Filters`}
        </button>
        <div className={styles.sortByContainer}>
          Sort by &nbsp;
          <select className={styles.sortBy}
            onChange={(e) => {
              setSelectedOption(options[Number(e.target.value)]);
            }}>
            <option value="0">Popularity</option>
            <option value="1">Name: A-Z</option>
            <option value="2">Name: Z-A</option>
            <option value="3">Newest to Oldest</option>
            <option value="4">Oldest to Newest</option>
          </select>
        </div>
      </div>
      <p className={styles.paginationInfo}>
        {productsData?.data?.length > 0 && `Showing ${paginationStartIndex}-${paginationEndIndex} of ${totalItems} Total Products`}
        {!(productsData?.data?.length > 0) &&  `No Results`}
      </p>
      <div className={styles.items}>
        {productsData && productsData?.data?.map((product, index) => {
          const ratingOutOfFive = +(Math.round(product.score/2 + "e+2")  + "e-2");
          return (
            // sometimes the api response has 2+ items with the same 'mal_id'
            <div key={index} className={styles.itemInfoContainer}>
              <div className={styles.itemInfo}>
                <NavLink to={`/products/${productType}/${product.mal_id}`}>
                  <img src={product.images.jpg.large_image_url} alt="" />
                </NavLink>
                <NavLink to={`/products/${productType}/${product.mal_id}`}>
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
      {productsData?.data?.length > 0 && 
        <Pagination 
          totalPages={totalPages} 
          currentPage={currentPage} 
          onPageChange={handlePageChange}
        />}
      {productsData?.data?.length > 0 && 
        <div className={styles.backToTop} onClick={() => window.scrollTo({ top: 0})}>Back to top</div>
      }
    </div>
  )
}

export default Shop;
