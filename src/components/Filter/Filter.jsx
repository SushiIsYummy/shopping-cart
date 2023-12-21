import { useEffect, useState } from "react";
import { 
  Form, 
  useSearchParams, 
} from "react-router-dom";
import styles from './Filter.module.css';

function Filter({
  genresData,
}) {
  
  const [openCategories, setOpenCategories] = useState({});
  const [filters, setFilters] = useState({
    genres: [],
    minScore: '',
    maxScore: '',
    productType: '',
  });
  const [searchParams, setSearchParams] = useSearchParams();
  
  const genresParam = searchParams.get('genres');
  const genresList = genresParam ? genresParam.split('_') : [];
  const productTypeParam = searchParams.get('productType');
  const minScoreParam = searchParams.get('minScore') ?? '';
  const maxScoreParam = searchParams.get('maxScore') ?? '';

  useEffect(() => {
    setFilters((prevFilters) => {
      const genresList = genresParam ? genresParam.split('_') : [];
      return {
        ...prevFilters,
        genres: genresList.length > 0 ? genresList : [],
        productType: productTypeParam ? productTypeParam : '',
        maxScore: maxScoreParam ? maxScoreParam : '',
        minScore: minScoreParam ? minScoreParam : '',
      }
    })
  }, [genresParam, maxScoreParam, minScoreParam, productTypeParam]);


  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedSearchParams = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && !(Array.isArray(value) && value.length === 0)) {
        updatedSearchParams.set(key, Array.isArray(value) ? value.join('_') : value);
      }
    });
    updatedSearchParams.set('page', '1');
    setSearchParams(updatedSearchParams);
  };

  const handleReset = () => {
    const resetValues = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        resetValues[key] = [];
      }
      else if (typeof value === 'string') {
        resetValues[key] = '';
      }
    })
    setFilters({...resetValues, productType: productTypeParam});
  }

  const handleFilterChange = (category, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [category]: value }));
  };

  const toggleGenre = (genre) => {
    const updatedGenres = [...filters.genres];
    const genreIndex = updatedGenres.indexOf(genre);

    if (genreIndex !== -1) {
      updatedGenres.splice(genreIndex, 1);
    } else {
      updatedGenres.push(genre);
    }

    return updatedGenres;
  };

  function handleCategoryClick(category) {
    setOpenCategories((openCategories) => ({
      ...openCategories, 
      [category]: !openCategories[category],
    }))
  }
  
  return (
    <Form className={styles.filterContainer} onSubmit={handleSubmit}>
      <div className={styles.filterOption}>
        <div className={styles.categoryHeader} onClick={() => handleCategoryClick('products')}>
          <div className={styles.category}>Products</div>
          <div className={styles.plusMinus}>{openCategories['products'] ? '-' : '+'}</div>
        </div>
        <div className={`${styles.options} ${(openCategories['products'] !== null && !openCategories['products'] && `${styles.hide}`) || ''}`}>
          <label>
            <input 
              type="radio" 
              name='productType' 
              value='anime' 
              onChange={(e) => {
                handleFilterChange('productType', e.target.value);
                setSearchParams((searchParams) => ({ ...Object.fromEntries(searchParams), productType: e.target.value }));
              }}
              checked={filters.productType === 'anime'}  
              />
            &nbsp;Anime
          </label>
          <label>
            <input 
              type="radio" 
              name='productType' 
              value='manga' 
              onChange={(e) => {
                handleFilterChange('productType', e.target.value)
                setSearchParams((searchParams) => ({ ...Object.fromEntries(searchParams), productType: e.target.value }));
              }}
              checked={filters.productType === 'manga'}  
            />
            &nbsp;Manga
          </label>
        </div>
      </div>
      <div className={styles.filterOption}>
        <div className={styles.categoryHeader} onClick={() => handleCategoryClick('genres')}>
          <div className={styles.category}>Genres ({genresData && genresData.length})</div>
          <div className={styles.plusMinus}>{openCategories['genres'] ? '-' : '+'}</div>
        </div>
        <div className={`${styles.options} ${(openCategories['genres'] !== null && !openCategories['genres'] && `${styles.hide}`) || ''}`}>
          {genresData && genresData.map((genre) => 
            <label key={genre.name}>
              <input 
                type='checkbox' 
                value={genre.mal_id} 
                checked={filters.genres.includes(genre.name)}
                onChange={() => {
                  handleFilterChange('genres', toggleGenre(genre.name));
                }}
              />
              &nbsp;{genre.name}
              {filters.genres.includes(genre.name) !== genresList.includes(genre.name) && <span className={styles.unsavedChanges} ></span>}
            </label>
          )}
        </div>
      </div>
      <div className={styles.filterOption}>
        <div className={styles.categoryHeader} onClick={() => handleCategoryClick('scores')}>
          <div className={styles.category}>Scores</div>
          <div className={styles.plusMinus}>{openCategories['scores'] ? '-' : '+'}</div>
        </div>
        <div className={`${styles.options} ${(openCategories['scores'] !== null && !openCategories['scores'] && `${styles.hide}`) || ''}`}>
          <label>
            Min Score: &nbsp;
            <input type="number" value={filters.minScore} name='minScore' min='0' max='5' step='0.01' onChange={(e) => handleFilterChange('minScore', e.target.value)}/>
            {filters.minScore !== minScoreParam && <span className={styles.unsavedChanges} ></span>}
          </label>
          <label>
            Max Score: &nbsp;
            <input type="number" value={filters.maxScore} name='maxScore' min='0' max='5' step='0.01' onChange={(e) => handleFilterChange('maxScore', e.target.value)}/>

            {filters.maxScore !== maxScoreParam && <span className={styles.unsavedChanges} ></span>}
          </label>
        </div>
      </div>
      <div className={styles.filterResetButtons} >
        <button className={styles.filterButton} type='submit'>FILTER</button>
        <button className={styles.resetButton} type='button' onClick={handleReset}>RESET</button>
      </div>
    </Form>
  );
}

export default Filter;