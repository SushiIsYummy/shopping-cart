import './ProductInfo.css';
import { useState } from 'react';
import { 
  Form,
  NavLink,
  useLoaderData,
} from "react-router-dom";
import { getAnimeInfo, getMangaInfo } from '../../api';


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
  return { productInfo };
}

function ProductInfo() {
  const { productInfo } = useLoaderData();
  const productTitle = productInfo.data.title;
  console.log(productInfo);
  const fakePrice = generateFakePrice(productTitle);
  return (
    <>
      <h1 className='product-name mobile'>{productTitle}</h1>
      <img src={productInfo.data.images.jpg.large_image_url} alt={`cover of ${productTitle}`} />
      <p>{fakePrice}</p>
      <p>Quantity: <input type="text" /></p>
    </>
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
