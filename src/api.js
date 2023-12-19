import { DateTime } from 'luxon';

const baseUrl = 'https://api.jikan.moe/v4';
const animeStartDate = '1960-01-01';
const animeEndDate = getCurrentSeasonParameters().end;

export async function getNewSeasonalAnimeList() {
  const { start, end } = getCurrentSeasonParameters();
  const dateParams = `start_date=${start}&end_date=${end}`;
  const response = await fetch(`${baseUrl}/anime?${dateParams}`);
  const json = await response.json();
  return json;
}

export async function getNewSeasonalMangaList() {
  const { start } = getCurrentSeasonParameters();
  const dateParams = `start_date=${start}`;
  const response = await fetch(`${baseUrl}/manga?${dateParams}`);
  const json = await response.json();
  return json;
}

export async function getAnimeInfo(animeId) {
  const response = await fetch(`${baseUrl}/anime/${animeId}`);
  const json = await response.json();
  return json;
}

export async function getPopularAnimeInfo(pageNumber = 1, filterParams) {
  const response = await fetch(`${baseUrl}/anime?start_date=${animeStartDate}&order_by=popularity&page=${pageNumber}&${filterParams ? filterParams : ''}`);
  const json = await response.json();
  return json;
}

export async function getSortedAZAnimeInfo(pageNumber = 1, filterParams) {
  const response = await fetch(`${baseUrl}/anime?start_date=${animeStartDate}&order_by=title&page=${pageNumber}&${filterParams ? filterParams : ''}`);
  const json = await response.json();
  return json;
}

export async function getSortedZAAnimeInfo(pageNumber = 1, filterParams) {
  const response = await fetch(`${baseUrl}/anime?start_date=${animeStartDate}&order_by=title&sort=desc&page=${pageNumber}&${filterParams ? filterParams : ''}`);
  const json = await response.json();
  return json;
}

export async function getOldestAnimeInfo(pageNumber = 1, filterParams) {
  const response = await fetch(`${baseUrl}/anime?start_date=${animeStartDate}&end_date=${animeEndDate}&order_by=start_date&page=${pageNumber}&${filterParams ? filterParams : ''}`);
  const json = await response.json();
  return json;
}
export async function getNewestAnimeInfo(pageNumber = 1, filterParams) {
  const response = await fetch(`${baseUrl}/anime?start_date=${animeStartDate}&end_date=${animeEndDate}&order_by=start_date&sort=desc&page=${pageNumber}&${filterParams ? filterParams : ''}`);
  const json = await response.json();
  return json;
}
export async function getAnimeGenres() {
  const response = await fetch(`${baseUrl}/genres/anime`);
  const json = await response.json();
  return json;
}

export async function getMangaInfo(mangaId) {
  const response = await fetch(`${baseUrl}/manga/${mangaId}`);
  const json = await response.json();
  return json;
}

export async function getPopularMangaInfo(pageNumber = 1, filterParams) {
  const response = await fetch(`${baseUrl}/manga?start_date=${animeStartDate}&order_by=popularity&page=${pageNumber}&${filterParams ? filterParams : ''}`);
  const json = await response.json();
  return json;
}

export async function getSortedAZMangaInfo(pageNumber = 1, filterParams) {
  const response = await fetch(`${baseUrl}/manga?start_date=${animeStartDate}&order_by=title&page=${pageNumber}&${filterParams ? filterParams : ''}`);
  const json = await response.json();
  return json;
}

export async function getSortedZAMangaInfo(pageNumber = 1, filterParams) {
  const response = await fetch(`${baseUrl}/manga?start_date=${animeStartDate}&order_by=title&sort=desc&page=${pageNumber}&${filterParams ? filterParams : ''}`);
  const json = await response.json();
  return json;
}

export async function getOldestMangaInfo(pageNumber = 1, filterParams) {
  const response = await fetch(`${baseUrl}/manga?start_date=${animeStartDate}&end_date=${animeEndDate}&order_by=start_date&page=${pageNumber}&${filterParams ? filterParams : ''}`);
  const json = await response.json();
  return json;
}
export async function getNewestMangaInfo(pageNumber = 1, filterParams) {
  const response = await fetch(`${baseUrl}/manga?start_date=${animeStartDate}&end_date=${animeEndDate}&order_by=start_date&sort=desc&page=${pageNumber}&${filterParams ? filterParams : ''}`);
  const json = await response.json();
  return json;
}

export async function getMangaGenres() {
  const response = await fetch(`${baseUrl}/genres/manga`);
  const json = await response.json();
  return json;
}

function getCurrentSeasonParameters() {
  const today = DateTime.local();
  let start, end, season;

  if (today.month >= 1 && today.month <= 3) {
    // Winter (1st quarter)
    start = DateTime.local(today.year, 1, 1);
    end = DateTime.local(today.year, 3, 31);
    season = 'Winter';
  } else if (today.month >= 4 && today.month <= 6) {
    // Spring (2nd quarter)
    start = DateTime.local(today.year, 4, 1);
    end = DateTime.local(today.year, 6, 30);
    season = 'Spring';
  } else if (today.month >= 7 && today.month <= 9) {
    // Summer (3rd quarter)
    start = DateTime.local(today.year, 7, 1);
    end = DateTime.local(today.year, 9, 30);
    season = 'Summer';
  } else {
    // Fall (4th quarter)
    start = DateTime.local(today.year, 10, 1);
    end = DateTime.local(today.year, 12, 31);
    season = 'Fall';
  }
  start = start.toFormat('yyyy-MM-dd');
  end = end.toFormat('yyyy-MM-dd');
  return { start, end, season };
}

export function getCurrentSeason() {
  const today = DateTime.local();
  let season;

  if (today.month >= 1 && today.month <= 3) {
    season = 'Winter';
  } else if (today.month >= 4 && today.month <= 6) {
    season = 'Spring';
  } else if (today.month >= 7 && today.month <= 9) {
    season = 'Summer';
  } else {
    season = 'Fall';
  }
  return season;
}
