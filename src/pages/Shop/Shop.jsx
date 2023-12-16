import { useEffect, useState } from 'react'
import styles from './Shop.module.css';
import { getPopularAnimeInfo } from '../../api';
import { useLoaderData } from 'react-router-dom';
import generateFakePrice from '../../utils/generateFakePrice';
import StarRating from '../../components/StarRating/StarRating';
import Pagination from '../../components/Pagination/Pagination';

export async function loader() {
  const popularAnime = await getPopularAnimeInfo();
  console.log(popularAnime);
  return { popularAnime };
}

function Shop() {
  // const { popularAnime } = useLoaderData();
  const options = ['popularity', 'AZ', 'ZA'];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [productsData, setProductsData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = productsData ? productsData.pagination.last_visible_page : null;

  console.log(productsData);
  useEffect(() => {
    async function fetchData() {
      let updatedData;
      if (selectedOption === 'popularity') {
        updatedData = await getPopularAnimeInfo(currentPage);
      } else if (selectedOption === 'AZ') {
        // updatedData = await getPopularAnimeInfo();
      }
      setProductsData(updatedData);
    }
    if (selectedOption) {
      fetchData();
    }
  }, [selectedOption, currentPage])

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }

  return (
    <div className={styles.shop}>
      <div className={styles.sortBar}>
        Sort by &nbsp;
        <select name="sort-by" 
          onChange={(e) => {
            setSelectedOption(options[Number(e.target.value)]);
          }}>
          <option value="0">Popularity</option>
          <option value="1">Name: A-Z</option>
          <option value="2">Name: Z-A</option>
        </select>
      </div>
      <div className={styles.items}>
        {productsData && productsData.data.map((anime) => {
          const ratingOutOfFive = +(Math.round(anime.score/2 + "e+2")  + "e-2");
          return (
            <div key={anime.mal_id} className={styles.itemInfo}>
              <img src={anime.images.jpg.large_image_url} alt="" />
              <p className={styles.itemTitle}>{anime.title}</p>
              <div className={styles.starRatingContainer}>
                <p className={styles.ratingDecimal}>{ratingOutOfFive}</p>
                <StarRating rating={ratingOutOfFive}></StarRating>
                <p className={styles.reviews}>({anime.scored_by})</p>
              </div>
              <p className={styles.price}>${generateFakePrice(anime.title)}</p>
              <button className={styles.addToCart}>ADD TO CART</button>
            </div>
          )
        })}
      </div>
      {productsData && 
        <Pagination 
          totalPages={totalPages} 
          currentPage={currentPage} 
          onPageChange={handlePageChange}
        />
      }
      {productsData && <div className={styles.backToTop}>Back to top</div>}
    </div>
  )
}

export default Shop;
