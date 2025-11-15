"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";
export default function PizzeriaSlugSlider({ pizzeriaData }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <div>
      <Slider {...settings}>
        {pizzeriaData.photos?.map((photo, index) => (
          <div key={index} className="px-2">
            <Image
              src={photo}
              alt={`Zdjęcie ${index + 1} z ${pizzeriaData.name}`}
              width={400}
              height={300}
              className="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-full h-[300px] object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
