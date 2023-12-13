import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import ProductImage from '../ProductImage/ProductImage';
import { useRef } from 'react';
import './Carousel.css';
import { NavLink } from 'react-router-dom';

function Carousel({
  productType,
  productList,
  headerTitle,
 }) {
  const swiperRef = useRef();
  const prevButton = useRef(null);
  const nextButton = useRef(null);

  function handleNextIconOnHover() {
    prevButton.current.classList.add('hide');
  }

  function handleNextIconOnHoverLeave() {
    prevButton.current.classList.remove('hide');
  }

  return (
    <div className='carousel'>
      <h1 className='header-title'>{headerTitle}</h1>
      <div className='swooper'>
        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          breakpoints={{
            768: {
              slidesPerView: 3.5
            },
            1201: {
              slidesPerView: 4.5
            },
            1400: {
              slidesPerView: 5.5
            },
          }}
          loop={true}
          spaceBetween={10}
          slidesPerView={2.5}
        >
          {productList.data.map((productData) =>
            <SwiperSlide key={productData.title}>
              <ProductImage
                productImg={productData.images.jpg.large_image_url}
                productTitle={productData.title}
                productId={productData.mal_id}
                productType={productType}
              />
            </SwiperSlide>
          )}
        </Swiper>
        <div className='navigation-buttons'>
          <i 
            ref={prevButton} 
            className='custom-prev-icon fa fa-3x fa-solid fa-angle-left' 
            onClick={() => swiperRef.current?.slidePrev()}
          />
          <i 
            ref={nextButton} 
            className='custom-next-icon fa fa-3x fa-solid fa-angle-right' 
            onMouseOver={handleNextIconOnHover} 
            onMouseLeave={handleNextIconOnHoverLeave} 
            onClick={() => swiperRef.current?.slideNext()}
          />
        </div>
      </div>
    </div>
  );
}

export default Carousel;