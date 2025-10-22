import './Banner.css';
import roseHead from '../../assets/images/ROSE_head.jpg';

function Banner() {
  return (
    <header className="banner">
      <img src={roseHead} alt="Powered by Rose Banner" />
    </header>
  );
}

export default Banner;
