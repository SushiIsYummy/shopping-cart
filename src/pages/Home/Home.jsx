import Carousel from '../../components/Carousel/Carousel';
import { 
  useLoaderData,
} from "react-router-dom";
import './Home.css';
import { getCurrentSeason, getNewSeasonalAnimeList, getNewSeasonalMangaList } from '../../api';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useState } from 'react';
import { useMediaQuery } from '@react-hook/media-query';
// SwiperCore.use([Autoplay]);

export async function loader() {
  const anime = await getNewSeasonalAnimeList();
  const manga = await getNewSeasonalMangaList();
  console.log(anime)
  return { anime, manga };
}

export async function action() {
}

function Home() {
  const useSwiper = useMediaQuery('(max-width: 1200px)');
  const { anime, manga } = useLoaderData();
  const currentSeason = getCurrentSeason();
  const currentYear = DateTime.local().year;
  return (
    <div className='home'>
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
                    <Link>Samurai Champloo</Link>
                    <img src='/samurai-champloo-fight.gif'></img>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <h1>Featured Manga</h1>
                  <div className="featured-manga">
                    <Link>One Punch Man</Link>
                    <img src='/one-punch-man.jpeg'></img>
                  </div>
                </SwiperSlide>
              </Swiper>
            </>
          ) : (
            <>
              <h1>Featured Anime</h1>
              <div className="featured-anime">
                <Link>Samurai Champloo</Link>
                <img src='/samurai-champloo-fight.gif'></img>
              </div>
              <h1>Featured Manga</h1>
              <div className="featured-manga">
                <Link>One Punch Man</Link>
                <img src='/one-punch-man.jpeg'></img>
              </div>
            </>
          )}
        </div>
        <div className="popular-anime-and-manga-container">
          <h1>Popular Anime and Manga</h1>
          <div className="popular-anime-and-manga">
            <div className="anime-manga-container berserk">
              <h1 className='name'>Berserk - <Link>Manga</Link></h1>
              <img src="/berserk.webp" alt="" />
            </div>
            <div className="right-side">
              <div className="anime-manga-container death-note">
                <h1 className='name'>Death Note - <Link>Manga</Link> / <Link>Anime</Link></h1>
                <img src="/death-note.jpg" alt="" />
              </div>
              <div className="anime-manga-container aot">
                <h1 className='name'>Attack on Titan - <Link>Manga</Link> / <Link>Anime</Link></h1>
                <img src="/aot.jpg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Carousel productList={anime} headerTitle={`New ${currentSeason} Anime ${currentYear}`}/>
      <Carousel productList={manga} headerTitle={`New ${currentSeason} Manga ${currentYear}`}/>
    </div>
  )
}

export default Home;
