import { createContext, useContext, useState, useRef, useEffect } from 'react';

const MiniCartContext = createContext();

export const MiniCartProvider = ({ children }) => {
  const [cartIsOpen, setCartIsOpen] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [initiateScroll, setInitiateScroll] = useState(false);
  const [productType, setProductType] = useState(null);
  const [productId, setProductId] = useState(null);

  const miniCartItems = useRef();

  // scroll to added item
  useEffect(() => {
    if (initiateScroll) {
      let childToScroll = null;
  
      if (miniCartItems?.current?.children) {
        childToScroll = Array.from(miniCartItems?.current?.children).find(
          (child) => child.getAttribute('data-id') === `${productType}-${productId}`
        );
      }
  
      if (childToScroll) {
        childToScroll.scrollIntoView({ block: 'nearest' });
        setInitiateScroll(false);
      }
      console.log('SCROLLED TO TARGETED CART ITEM');
    }
  }, [initiateScroll, miniCartItems, productId, productType]);

  const openMiniCart = (timer) => {
    setCartIsOpen(true);

    // optional timer (in milliseconds) to close the mini cart when timer finishes
    // if (timer) {

    //   if (timerId) {
    //     clearTimeout(timerId);
    //   }

    //   const newTimerId = setTimeout(() => {
    //     closeMiniCart();
    //   }, timer)

    //   setTimerId(newTimerId);
    // }
  }

  const closeMiniCart = () => setCartIsOpen(false);

  const scrollToMiniCartItem = (productType, productId) => {
    setProductType(productType);
    setProductId(productId);
    setInitiateScroll(true);
  }

  return (
    <MiniCartContext.Provider value={{ cartIsOpen, openMiniCart, closeMiniCart, miniCartItems, scrollToMiniCartItem }}>
      {children}
    </MiniCartContext.Provider>
  );
};

export const useMiniCart = () => {
  const context = useContext(MiniCartContext);
  if (!context) {
    throw new Error('useMiniCart must be used within a MiniCartProvider');
  }
  return context;
};