import { useState, useEffect } from 'react';
import styles from './SlideInModal.module.css';

function SlideInModal({ 
  isOpen, 
  onClose, 
  children 
}) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const body = document.body;

    function verticalScrollbarVisible() {
      return window.innerWidth > body.clientWidth;
    }

    if (isOpen) {
      if (verticalScrollbarVisible()) {
        let scrollbarLength = window.innerWidth - body.clientWidth;
        body.style.marginRight = isOpen ? `${scrollbarLength}px` : '0px';
      }
      body.style.overflow = isOpen ? 'hidden' : 'auto';
    }

    return () => {
      if (verticalScrollbarVisible()) {
        body.style.marginRight = '0px';
      }
      body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const onAnimationEnd = () => {
    if (!isOpen) {
      setIsClosing(false);
      onClose();
    }
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isOpen ? styles.open : ''} ${isClosing && !isOpen ? styles.closing : ''}`}
      onClick={isOpen ? null : onClose}
    >
      <div
        className={`${styles.modalContent} ${isOpen ? styles.open : ''} ${isClosing && !isOpen? styles.closing : ''}`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={onAnimationEnd}
      >
        {children}
        {/* <button className={styles.closeButton} onClick={onClose}>
          Close
        </button> */}
      </div>
    </div>
  );
}

export default SlideInModal;
