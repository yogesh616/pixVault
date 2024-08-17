import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import Loader from './Loader';

function App() {
  const [prompt, setPrompt] = useState('Earth');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const carouselRef = useRef(null);
  const startX = useRef(0);

  

  useEffect(() => {
   getData(prompt);
  }, []);
  

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      getData(prompt); // Pass the current prompt to getData
    }
  };

  async function getData(currentPrompt) {
    const url = 'https://4k-wallpapers-scraper.vercel.app/api';
    setIsLoading(true);
    try {
      const res = await axios.post(url, { prompt: currentPrompt });

      if (inputRef.current) {
        inputRef.current.blur();
        setPrompt(''); // Clear the prompt input after the request
      }
      if (res.data === '') {
        alert('No images found for the provided prompt.');
        return;
      }
      if (res.data.vectorData && res.data.vectorData.length > 0) {
        const extractedData = res.data.vectorData.map((item) => ({
          thumbnail: item.src,
          original: item.imgDownload,
        }));

        setData(extractedData);
        setIsLoading(false);
        localStorage.setItem('lastPrompt', currentPrompt);
        localStorage.setItem('lastData',JSON.stringify(extractedData));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleTouchStart = (event) => {
    startX.current = event.touches[0].clientX;
  };

  const handleTouchMove = (event) => {
    const moveX = event.touches[0].clientX;
    const diffX = startX.current - moveX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        carouselRef.current.querySelector('.carousel-control-next').click();
      } else {
        carouselRef.current.querySelector('.carousel-control-prev').click();
      }
      startX.current = moveX;
    }
  };

  return (
    <>
      {data.length > 0 ? (
        <>
          {/* Search Bar */}
          <div className="input-wrapper">
            <button onClick={() => getData(prompt)} className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25px" width="25px">
                <path
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                  stroke="#fff"
                  d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                ></path>
                <path
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                  stroke="#fff"
                  d="M22 22L20 20"
                ></path>
              </svg>
            </button>
            <input
              onKeyDown={handleEnterKey}
              ref={inputRef}
              value={prompt} // Ensure the input reflects the current state
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="search.."
              className="input"
              name="text"
              type="text"
            />
          </div>
          {/* Loader */}
          {isLoading && <Loader />}

          {/* Carousel */}
          <div
            id="carouselExampleInterval"
            className="carousel slide"
            data-bs-ride="carousel"
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div className="carousel-inner">
              {data.map((item, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? 'active' : ''}`}
                  data-bs-interval="5000"
                >
                  <img src={item.original} className="d-block w-100" alt={`Slide ${index + 1}`} />
                  {/* Download Button */}
                  <a className="Btn" href={item.original}>
                    <svg
                      className="svgIcon"
                      viewBox="0 0 384 512"
                      height="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                    </svg>
                    <span className="icon2"></span>
                  </a>
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleInterval"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleInterval"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default App;
