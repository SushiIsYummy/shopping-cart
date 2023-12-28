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
import { addToCart } from '../../cartItemsLocalStorage';
import AddToCartModal from '../../components/AddToCartModal/AddToCartModal';
import { useMiniCart } from '../MiniCart/MiniCartContext';
import { useEffect, useRef } from 'react';
import { AddToCartModals } from '../../components/AddToCartModal/AddToCartModal';
import { MiniCartProvider } from '../MiniCart/MiniCartContext';

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
  const [quantity, setQuantity] = useState(1);
  const [modals, setModals] = useState([]);
  const { cartIsOpen, openMiniCart, closeMiniCart, miniCartItems, scrollToMiniCartItem } = useMiniCart();
  const { productInfo, productType } = useLoaderData();
  const navigate = useNavigate();

  // console.log(modals)
  // console.log(productInfo);
  const originalRating = productInfo.data.score;
  const ratingOutOfFive = Number(+(Math.round(Math.floor(originalRating/2 * 100) / 100 + "e+2")  + "e-2")).toFixed(2);
  const publishedDate = productType === 'manga' ? formatPublishDates(productInfo.data.published.from, productInfo.data.published.to) : null;
  const productTitle = productInfo.data.title;
  const productId = productInfo.data.mal_id;
  const productImage = productInfo.data.images.jpg.large_image_url;
  const fakePrice = generateFakePrice(productTitle);

  function handleAddToCartClick() {
    let newItem = {};
    newItem['quantity'] = quantity;
    newItem['productId'] = productId;
    newItem['productType'] = productType;
    newItem['productImage'] = productImage;
    newItem['productTitle'] = productTitle;
    newItem['price'] = fakePrice;
    let addedToCart = addToCart(newItem);
    addModal(addedToCart);
    openMiniCart();
    scrollToMiniCartItem(productType, productId);
  }

  function handleQuantityChange(e) {
    console.log(typeof e.target.value);
    setQuantity(Number(e.target.value));
  }

  function addModal(success) {
    let modalId = crypto.randomUUID();
    setModals((prevModals) => [...prevModals, 
      { 
        message: success ? 'Product added to cart' : 'Max 3 quantity allowed per product', 
        success: success ? true : false,
        id: modalId,
      }])
  }

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
          <img className='product-img' src={productImage} alt={`cover of ${productTitle}`} />
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
          <p className='quantity'>Quantity: &nbsp;
            <select onChange={handleQuantityChange} value={quantity}>
              {Array.from({ length: 3 }, (_, index) => (
                <option key={index}>{index + 1}</option>
              ))}
            </select>
          </p>
          <button className='add-to-cart' onClick={handleAddToCartClick}>ADD TO CART</button>
          <AddToCartModals modals={modals} setModals={setModals} position={'center'}></AddToCartModals>
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
