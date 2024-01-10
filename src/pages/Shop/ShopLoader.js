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

// the loader function gets called when setSearchParams is called, so I
// set a useLoader item in session storage to indicate what to fetch
export async function loader({ request }) {
  const requestUrl = new URL(request.url);
  let loaderGenresData = null;

  let loaderShowFiltersLargeScreen;
  let showFiltersLSParam = requestUrl.searchParams.get('showFiltersLS');
  if (
    showFiltersLSParam &&
    (showFiltersLSParam === 'true' || showFiltersLSParam === 'false')
  ) {
    loaderShowFiltersLargeScreen = showFiltersLSParam === 'true';
  } else {
    loaderShowFiltersLargeScreen = true;
  }

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

  return {
    loaderGenresData,
    loaderProductsData,
    loaderShowFiltersLargeScreen,
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
      } else if (productType === 'manga') {
        genresData = await getMangaGenres();
      }
      refetch = true;
    } while (genresData && genresData.status === '429');
    return genresData;
  } catch (error) {
    console.error(error);
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
      }
      refetch = true;
    } while (productsData && productsData.status === '429');
    return productsData;
  } catch (error) {
    console.error(error);
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
