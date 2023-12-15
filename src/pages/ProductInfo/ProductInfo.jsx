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
import generateFakePrice from '../../utils/generateFakePrice';

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
  const originalRating = productInfo.data.score;
  const ratingOutOfFive = +(Math.round(originalRating/2 + "e+2")  + "e-2");
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
            <p className='authors mobile'>Author(s): &nbsp;
              {productInfo.data.authors.map((author) => `[${author['name']}]`).join(', ')}
            </p>
          }
          <div className='rating mobile'>
            {originalRating ? (
              <>
                <p>{ratingOutOfFive}</p>
                <StarRating rating={ratingOutOfFive}></StarRating>
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
            <p className='authors'>Author(s): &nbsp;
              {productInfo.data.authors.map((author) => `[${author['name']}]`).join(', ')}
            </p>
          }
          <div className='rating'>
            {originalRating ? (
              <>
                <p>{ratingOutOfFive}</p>
                <StarRating rating={ratingOutOfFive}></StarRating>
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

export default ProductInfo;
