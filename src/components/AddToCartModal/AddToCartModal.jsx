import { useRef, useState } from 'react';
import styles from './AddToCartModal.module.css';
import { useEffect } from 'react';
import { useMiniCart } from '../../pages/MiniCart/MiniCartContext';

export function AddToCartModals({
  modals,
  setModals,
  position,
}) {
  const { cartIsOpen, openMiniCart, closeMiniCart } = useMiniCart();
  const modalArea = useRef();


  useEffect(() => {
    const body = document.body;

    function verticalScrollbarVisible() {
      return window.innerWidth > body.clientWidth;
    }

    let scrollbarLength = window.innerWidth - body.clientWidth;
    if (verticalScrollbarVisible()) {
      modalArea.current.style.left = `calc(${body.clientWidth/2}px + ${scrollbarLength/2}px)`;
    }

    const handleResize = () => {
      if (verticalScrollbarVisible()) {
        modalArea.current.style.left = `calc(${body.clientWidth/2}px + ${scrollbarLength/2}px)`;
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [cartIsOpen]);

  
  // function addModal() {
  //   let modalId = crypto.randomUUID();
  //   setModals((prevModals) => [...prevModals, 
  //     { 
  //       message: addedToCart ? 'Product added to cart' : 'Max 3 quantity allowed per product', 
  //       success: addedToCart ? true : false,
  //       id: modalId,
  //     }])
    // setModals((prevModals) => [...prevModals, {}])
  // }

  function removeModal(id) {
    setModals((prevModals) => prevModals.filter((modal) => 
      modal.id !== id
    ));
  }

  return (
    <div className={styles.modalArea} ref={modalArea} onClick={closeMiniCart}>
      {modals.map((modal) => 
        <AddToCartModal 
          key={modal.id} 
          message={modal.message} 
          removeModal={removeModal} 
          success={modal.success}
          modalId={modal.id}
        />
      )}
    </div>
  );
}

function AddToCartModal({ 
  message, 
  success,
  removeModal,
  modalId,
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
    setIsOpen(true)
  }, []);

  return (  
    <div 
      className={`${styles.modal} ${isOpen ? styles.open : styles.close} ${success ? styles.success : styles.fail}`}
      onTransitionEnd={!isOpen ? () => removeModal(modalId) : null}
    >
      <div className={styles.modalContent}>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default AddToCartModal;