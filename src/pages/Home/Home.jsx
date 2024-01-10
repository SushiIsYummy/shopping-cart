import Carousel from '../../components/Carousel/Carousel';
import { 
  useLoaderData, useNavigation,
} from "react-router-dom";
import './Home.css';
import { getCurrentSeason, getNewSeasonalAnimeList, getNewSeasonalMangaList } from '../../api';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useMediaQuery } from '@react-hook/media-query';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';

export async function loader() {
  try {
    let anime = await getNewSeasonalAnimeList();
    let manga = await getNewSeasonalMangaList();

    // fetch data again if there is a 429 error
    while (anime.status === '429' || manga.status === '429') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      anime = await getNewSeasonalAnimeList();
      manga = await getNewSeasonalMangaList();
    }
    return { anime, manga };
    
  } catch (error) {
    console.error(error);
    throw new Response("", {
      status: 429,
      statusText: "RateLimitException",
    });
  }
}

function Home() {
  const useSwiper = useMediaQuery('(max-width: 1200px)');
  const { anime, manga } = useLoaderData();
  const navigation = useNavigation();
  const currentSeason = getCurrentSeason();
  const currentYear = DateTime.local().year;
  
  return (
    <div className='home'>
      {navigation.state === 'loading' && <LoadingOverlay />}
      <section className="anime-and-manga-showcase">
        <div className="featured-anime-and-manga">
          {useSwiper ? ( 
            <>
              <Swiper
                navigation={true}
                loop={true}
                autoplay= {{
                  delay: 5000,
                  disableOnInteraction: false
                }}
                modules={[Autoplay]}
                >
                <SwiperSlide>
                  <h1>Featured Anime</h1>
                  <div className="featured-anime">
                    <Link to={`products/anime/205`}>Samurai Champloo</Link>
                    <img src='/samurai-champloo-fight.gif'></img>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <h1>Featured Manga</h1>
                  <div className="featured-manga">
                    <Link to={`products/manga/44347`}>One Punch Man</Link>
                    <img src='/one-punch-man.jpeg'></img>
                  </div>
                </SwiperSlide>
              </Swiper>
            </>
          ) : (
            <>
              <h1>Featured Anime</h1>
              <div className="featured-anime">
                <Link to={`products/anime/205`}>Samurai Champloo</Link>
                <img src='/samurai-champloo-fight.gif'></img>
              </div>
              <h1>Featured Manga</h1>
              <div className="featured-manga">
                <Link to={`products/manga/44347`}>One Punch Man</Link>
                <img src='/one-punch-man.jpeg'></img>
              </div>
            </>
          )}
        </div>
        <div className="popular-anime-and-manga-container">
          <h1>Popular Anime and Manga</h1>
          <div className="popular-anime-and-manga">
            <div className="anime-manga-container berserk">
              <h1 className='name'>Berserk - <Link to={`products/manga/2`}>Manga</Link></h1>
              <img src="/berserk.webp" alt="" />
            </div>
            <div className="right-side">
              <div className="anime-manga-container death-note">
                <h1 className='name'>Death Note - <Link to={`products/manga/21`}>Manga</Link> / <Link to={`products/anime/1535`}>Anime</Link></h1>
                <img src="/death-note.jpg" alt="" />
              </div>
              <div className="anime-manga-container aot">
                <h1 className='name'>Attack on Titan - <Link to={`products/manga/23390`}>Manga</Link> / <Link to={`products/anime/16498`}>Anime</Link></h1>
                <img src="/aot.jpg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Carousel productType='anime' productList={anime} headerTitle={`${currentSeason} ${currentYear} Anime ${anime?.data?.length > 0 ? '' : '(Coming Soon!)'}`}/>
      <Carousel productType='manga' productList={manga} headerTitle={`${currentSeason} ${currentYear} Manga ${manga?.data?.length > 0 ? '' : '(Coming Soon!)'}`}/>
    </div>
  )
}

export default Home;
