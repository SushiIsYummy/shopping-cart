import Carousel from '../../components/Carousel/Carousel';
import { 
  useLoaderData,
} from "react-router-dom";
import './Home.css';
import { getCurrentSeason, getNewSeasonalAnimeList, getNewSeasonalMangaList } from '../../api';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';

export async function loader() {
  const anime = await getNewSeasonalAnimeList();
  const manga = await getNewSeasonalMangaList();
  console.log(anime)
  return { anime, manga };
}

export async function action() {
}

function Home() {
  const { anime, manga } = useLoaderData();
  const currentSeason = getCurrentSeason();
  const currentYear = DateTime.local().year;
  console.log('hi')
  return (
    <>
      <section className="featured-anime-and-manga">
        <div className="featured-anime-gif">
          <h1>Featured Anime - <Link>Samurai Champloo</Link></h1>
          <img src='/samurai-champloo-fight.gif'></img>
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
    </>
  )
}

export default Home;
