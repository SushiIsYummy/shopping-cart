const cartItemsName = 'cartItems';
const maxQuantity = 3;
if (!localStorage.getItem(cartItemsName)) {
  localStorage.setItem(cartItemsName, JSON.stringify([]));
}

export function addToCart(newItem) {
  let cartItems = JSON.parse(localStorage.getItem(cartItemsName));
  let oldCartItems = null;
  if (cartItems) {
    oldCartItems = [...cartItems];
  }
  let cartItem = getCartItem(newItem.productId, newItem.productType);
  if (cartItem) {
    let newQuantity = Number(cartItem.quantity) + Number(newItem.quantity);
    let changedQuantity = changeCartItemQuantity(cartItem.productId, cartItem.productType, newQuantity);
    if (!changedQuantity) {
      window.dispatchEvent(new Event('cartItemsChanged'));
      return false;
    }
    window.dispatchEvent(new Event('cartItemsChanged'));
  } else {
    localStorage.setItem(cartItemsName, JSON.stringify([...oldCartItems, newItem]));
    window.dispatchEvent(new Event('cartItemsChanged'));
  }
  window.dispatchEvent(new Event('cartItemsChanged'));
  return true;
}

export function removeFromCart(productId, productType) {
  let cartItems = JSON.parse(localStorage.getItem(cartItemsName));
  let index = cartItems.findIndex((item) => Number(item.productId) === Number(productId) && item.productType === productType);
  cartItems.splice(index, 1);
  if (index !== -1) {
    localStorage.setItem(cartItemsName, JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartItemsChanged'));
  }
}

function getCartItem(productId, productType) {
  let cartItems = JSON.parse(localStorage.getItem(cartItemsName));
  let foundItem = cartItems.find((item) => Number(item.productId) === Number(productId) && item.productType === productType);

  if (foundItem) {
    return foundItem;
  }

  return null;
}

export function getTotalItemsInCart() {
  let cartItems = getCartItemsLocalStorage();
  let totalItems = cartItems.reduce((itemCount, item) => {
    return itemCount + Number(item.quantity);
  }, 0);
  return totalItems;
}

export function changeCartItemQuantity(productId, productType, newQuantity) {
  if (Number(newQuantity) > maxQuantity) {
    return false;
  }
  let cartItems = getCartItemsLocalStorage();
  let index = cartItems.findIndex((item) => item.productType === productType && item.productId === productId);
  if (cartItems && index !== -1) {
    cartItems[index].quantity = Number(newQuantity);
    localStorage.setItem(cartItemsName, JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartItemsChanged'));
    return true;
  }
}

export function getCartItemsLocalStorage() {
  let cartItems = JSON.parse(localStorage.getItem(cartItemsName));
  return cartItems;
}
