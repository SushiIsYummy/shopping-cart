import { NavLink } from 'react-router-dom'
import './ProductImage.css'

function ProductImage({ 
  productImg,
  productTitle,
  productId,
  productType,
}) {

  // const onProductClick() {

  // }

  return (
    <NavLink to={`products/${productType}/${productId}`}>
      <div className="product-image">
        <img src={productImg} alt={`cover image of ${productTitle}`} />
        <h1 className='title'>{productTitle}</h1>
      </div>
    </NavLink>
  );
}

export default ProductImage;