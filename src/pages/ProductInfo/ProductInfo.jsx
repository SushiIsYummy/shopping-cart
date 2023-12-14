import './ProductInfo.css';
import { useState } from 'react';
import { 
  Form,
  NavLink,
  useLoaderData,
  useNavigate
} from "react-router-dom";
import { getAnimeInfo, getMangaInfo } from '../../api';
import formatPublishDates from '../../utils/formatPublishDates';
import StarRating from '../../components/StarRating/StarRating';


export async function loader({ params }) {
  const productType = params.productType;
  console.log(productType)
  let productInfo;
  if (productType === 'anime') {
    productInfo = await getAnimeInfo(params.productId);
  } else if (productType === 'manga') {
    productInfo = await getMangaInfo(params.productId);
  }
  if (!productInfo) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { productInfo, productType };
}

function ProductInfo() {
  const { productInfo, productType } = useLoaderData();
  const productTitle = productInfo.data.title;
  console.log(productInfo);
  const fakePrice = generateFakePrice(productTitle);
  const navigate = useNavigate();
  const publishedDate = productType === 'manga' ? formatPublishDates(productInfo.data.published.from, productInfo.data.published.to) : null;
  console.log(publishedDate)
  return (
    <div className="product-info-container">
      <p className='back' onClick={() => { navigate(-1) }}>
        <i className='fa fa-2xs fa-solid fa-arrow-left'></i>
        Back
      </p>
      <div className='product-info'>
        <div className='left-side'>
          <h1 className='product-name mobile'>{productTitle}</h1>
          {productInfo.data?.authors && 
            <p className='authors mobile'>Authors: &nbsp;
              {productInfo.data.authors.map((author) => author['name']).join(', ')}
            </p>
          }
          <div className='rating mobile'>
            {productInfo.data.score ? (
              <>
                <p>{productInfo.data.score}</p>
                <StarRating rating={productInfo.data.score/2}></StarRating>
                <p>{productInfo.data.scored_by} ratings</p>
              </>
            ) : (
              'No rating yet'
            )}
          </div>
          <img className='product-img' src={productInfo.data.images.jpg.large_image_url} alt={`cover of ${productTitle}`} />
        </div>
        <div className="right-side">
          <h1 className='product-name'>{productTitle}</h1>
          {productInfo.data?.authors && 
            <p className='authors'>Authors: &nbsp;
              {productInfo.data.authors.map((author) => author['name']).join(', ')}
            </p>
          }
          <div className='rating'>
            {productInfo.data.score ? (
              <>
                <p>{productInfo.data.score}</p>
                <StarRating rating={productInfo.data.score/2}></StarRating>
                <p>{productInfo.data.scored_by} ratings</p>
              </>
            ) : (
              'No rating yet'
            )}
          </div>
          <p className='price'>${fakePrice}</p>
          <p className='quantity'>Quantity: <input type="number"/></p>
          <button className='add-to-cart'>ADD TO CART</button>
          <div className="synopsis-section">
            <p className='synopsis-header'>Synopsis</p>
            <p className='synopsis'>{productInfo.data.synopsis ? productInfo.data.synopsis : 'No synopsis available.'}</p>
          </div>
          {productInfo.data?.episodes ? <p>Episodes: {productInfo.data.episodes}</p> : null}
          {productInfo.data?.duration ? <p>Duration: {productInfo.data.duration}</p> : null}
          <p>Status: {productInfo.data.status}</p>
          {publishedDate ? <p>Published: {publishedDate}</p> : null}
          <p>Genres: &nbsp;
            {productInfo.data.genres.map(obj => obj['name']).join(', ')}
          </p>
        </div>
      </div>
    </div>
  )
}

function generateFakePrice(productTitle) {
  const hash = productTitle
    .split('')
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 100, 0);
  const minPrice = 9.99;
  const maxPrice = 59.99;
  const priceRange = maxPrice - minPrice;
  const fakePrice = (hash / 100) * priceRange + minPrice;
  return fakePrice.toFixed(2);
}

export default ProductInfo;
