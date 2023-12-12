import './ProductImage.css'

function ProductImage({ 
  productImg,
  productTitle,
}) {
  return (
    <div className="product-small">
      <img src={productImg} alt={`cover image of ${productTitle}`} />
      <h1 className='title'>{productTitle}</h1>
    </div>
  );
}

export default ProductImage;