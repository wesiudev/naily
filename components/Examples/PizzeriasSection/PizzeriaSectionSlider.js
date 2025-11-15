import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PizzaPlaceCard from "./PizzaPlaceCard";

export default function PizzeriaSectionSlider({ placesData, onCardClick }) {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto">
      <Slider {...settings}>
        {placesData?.map((place, index) => (
          <PizzaPlaceCard key={index} place={place} onCardClick={onCardClick} />
        ))}
      </Slider>
    </div>
  );
}
