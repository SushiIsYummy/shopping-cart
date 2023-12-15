function generateFakePrice(productTitle) {
  const hash = productTitle.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 100, 0);
  const minPrice = 9.99;
  const maxPrice = 59.99;
  const priceRange = maxPrice - minPrice;
  const fakePrice = (hash / 100) * priceRange + minPrice;
  return fakePrice.toFixed(2);
}

export default generateFakePrice;
