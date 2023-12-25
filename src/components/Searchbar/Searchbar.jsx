import styles from './Searchbar.module.css';
import { useState } from 'react';
import { 
  Form,
} from "react-router-dom";

function Searchbar({
  searchInput,
  setSearchInput,
}) {
  return (
    <Form className={styles.searchbar}>
      <button className={styles.submitButton} type='submit'>
        <i className='fa fa-solid fa-search'></i>
      </button>
      <input className={styles.searchInput} type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} spellCheck='false'/>
      <div className={styles.resetButtonContainer}>
        <button className={styles.resetButton} type='button' onClick={() => setSearchInput('')}>
          <i className="fa fa-solid fa-times"></i>
        </button>
      </div>
    </Form>
  )
}

export default Searchbar;
