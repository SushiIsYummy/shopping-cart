import styles from './StarRating.module.css';

function StarRating({
  rating
}) {
  return (
    <div className={styles.starRating}>
      {[...Array(5)].map((_, index) => {
        let colorPercent = rating > 1 ? 1 : (rating < 0 ? 0 : rating);
        const starStyleAfter = {
          position: 'absolute',
          left: 0,
          top: 0,
          width: `${colorPercent*100}%`,
          overflow: 'hidden',
          color: '#f80',
        };
        rating -= 1;
        return (
          <i key={index} className={`${styles.star} fa fa-solid fa-star`} >
            <i className={`${styles.star} fa fa-solid fa-star`} style={starStyleAfter}>
            </i>
          </i>
        )
      })}
    </div>
  )
}

export default StarRating;
