import {
  getAnimeGenres,
  getMangaGenres,
  getNewestAnimeInfo,
  getNewestMangaInfo,
  getOldestAnimeInfo,
  getOldestMangaInfo,
  getPopularAnimeInfo,
  getPopularMangaInfo,
  getSortedAZAnimeInfo,
  getSortedAZMangaInfo,
  getSortedZAAnimeInfo,
  getSortedZAMangaInfo,
} from '../../api';
import addUrlParam from '../../utils/addUrlParam';

// the loader function gets called when setSearchParams is called, so I
// set a useLoader item in session storage to indicate what to fetch
export async function loader({ request }) {
  console.log('LOADER CALLED!!!!');
  const requestUrl = new URL(request.url);
  console.log(requestUrl.searchParams.toString());
  // let genresParam = requestUrl.searchParams.get('genres');
  let loaderGenresData = null;

  let loaderShowFilters1;
  let loaderShowFilters2;

  let showFilters1Param = requestUrl.searchParams.get('showFilters1');
  let showFilters2Param = requestUrl.searchParams.get('showFilters2');
  console.log(showFilters1Param);
  console.log(showFilters2Param);
  if (
    showFilters1Param &&
    (showFilters1Param === 'true' || showFilters1Param === 'false')
  ) {
    loaderShowFilters1 = showFilters1Param === 'true';
  } else {
    // addUrlParam('showFilters1', 'false');
    console.log(requestUrl.toString());
    loaderShowFilters1 = false;
  }
  if (
    showFilters2Param &&
    (showFilters2Param === 'true' || showFilters2Param === 'false')
  ) {
    loaderShowFilters2 = showFilters2Param === 'true';
    console.log(showFilters2Param);
    console.log(loaderShowFilters2);
  } else {
    // addUrlParam('showFilters2', 'true');
    console.log(requestUrl.toString());
    loaderShowFilters2 = true;
  }

  // let loaderShowFilters2 = true;
  // if (sessionStorage.getItem('prevShowFilters2')) {
  //   loaderShowFilters2 = Boolean(sessionStorage.getItem('prevShowFilters2'));
  // } else if (window.history.state.showFilters2 === undefined) {
  //   loaderShowFilters2 = true;
  // } else {
  //   loaderShowFilters2 = window.history.state.showFilters2;
  // }
  // console.log(loaderShowFilters1);
  // console.log(loaderShowFilters2);
  // sessionStorage.removeItem('prevShowFilters1');
  // sessionStorage.removeItem('prevShowFilters2');

  let productTypeParam = requestUrl.searchParams.get('productType') || 'anime';
  let genresParam = requestUrl.searchParams.get('genres');
  let searchInputParam = requestUrl.searchParams.get('search');
  let minScoreParam = requestUrl.searchParams.get('minScore');
  let maxScoreParam = requestUrl.searchParams.get('maxScore');
  let sortByParam = requestUrl.searchParams.get('sortBy') || 'popularity';
  let pageParam = requestUrl.searchParams.get('page') || 1;

  let useLoaderArray =
    sessionStorage.getItem('useLoader') &&
    Array.isArray(JSON.parse(sessionStorage.getItem('useLoader')))
      ? JSON.parse(sessionStorage.getItem('useLoader'))
      : ['genres', 'products'];

  if (useLoaderArray.includes('genres')) {
    loaderGenresData = await fetchGenresData(productTypeParam);
    if (loaderGenresData) {
      sessionStorage.setItem('genres', JSON.stringify(loaderGenresData));
    }
  }

  let loaderProductsData = null;
  if (!loaderGenresData) {
    loaderGenresData = JSON.parse(sessionStorage.getItem('genres'));
  }
  if (useLoaderArray.includes('products')) {
    // console.log(loaderGenresData);
    loaderProductsData = await fetchProductsData(
      genresParam,
      loaderGenresData,
      searchInputParam,
      minScoreParam,
      maxScoreParam,
      productTypeParam,
      sortByParam,
      pageParam
    );
  }

  sessionStorage.removeItem('useLoader');
  // console.log(window.location.search);
  // console.log(loaderGenresData);
  // console.log(loaderProductsData);
  console.log(loaderShowFilters1);
  console.log(loaderShowFilters2);
  return {
    loaderGenresData,
    loaderProductsData,
    loaderShowFilters1,
    loaderShowFilters2,
  };
}

async function fetchGenresData(productType) {
  try {
    let refetch = false;
    let genresData = null;
    do {
      if (refetch) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (productType === 'anime') {
        genresData = await getAnimeGenres();
        console.log('got anime genres');
      } else if (productType === 'manga') {
        genresData = await getMangaGenres();
        console.log('got manga genres');
      }
      refetch = true;
    } while (genresData && genresData.status === '429');
    return genresData;
  } catch (error) {
    console.log(error);
    throw new Response('', {
      status: 429,
      statusText: 'RateLimitException',
    });
  }
}

async function fetchProductsData(
  genresParam,
  genresData,
  searchInputParam,
  minScoreParam,
  maxScoreParam,
  productTypeParam,
  sortByParam,
  pageParam
) {
  let filterParams = getFilterParams(
    genresParam,
    genresData,
    searchInputParam,
    minScoreParam,
    maxScoreParam
  );
  console.log(`filter params: ${filterParams}`);
  let productsData = null;
  try {
    let refetch = false;
    do {
      if (refetch) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (productTypeParam === 'anime') {
        if (sortByParam === 'popularity') {
          productsData = await getPopularAnimeInfo(pageParam, filterParams);
        } else if (sortByParam === 'AZ') {
          productsData = await getSortedAZAnimeInfo(pageParam, filterParams);
        } else if (sortByParam === 'ZA') {
          productsData = await getSortedZAAnimeInfo(pageParam, filterParams);
        } else if (sortByParam === 'newest') {
          productsData = await getNewestAnimeInfo(pageParam, filterParams);
        } else if (sortByParam === 'oldest') {
          productsData = await getOldestAnimeInfo(pageParam, filterParams);
        }
        console.log('got anime info!');
      } else if (productTypeParam === 'manga') {
        if (sortByParam === 'popularity') {
          productsData = await getPopularMangaInfo(pageParam, filterParams);
        } else if (sortByParam === 'AZ') {
          productsData = await getSortedAZMangaInfo(pageParam, filterParams);
        } else if (sortByParam === 'ZA') {
          productsData = await getSortedZAMangaInfo(pageParam, filterParams);
        } else if (sortByParam === 'newest') {
          productsData = await getNewestMangaInfo(pageParam, filterParams);
        } else if (sortByParam === 'oldest') {
          productsData = await getOldestMangaInfo(pageParam, filterParams);
        }
        console.log('got manga info!');
      }
      refetch = true;
    } while (productsData && productsData.status === '429');
    return productsData;
  } catch (error) {
    console.log(error);
    throw new Response('', {
      status: 429,
      statusText: 'RateLimitException',
    });
  }
}

function getFilterParams(
  genresParam,
  genresData,
  searchInputParam,
  minScoreParam,
  maxScoreParam
) {
  // console.log(genresData);
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
    filterParams = filterParams.concat(
      `min_score=${Math.round(minScoreParam * 2 + 'e+2') + 'e-2'}&`
    );
  }
  if (maxScoreParam) {
    filterParams = filterParams.concat(`max_score=${maxScoreParam * 2}&`);
  }
  return filterParams;
}
