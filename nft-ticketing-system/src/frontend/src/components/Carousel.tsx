import React from "react";
import Image from "next/image";
import Carousel1 from "../../public/carousel_1.png";
import Carousel2 from "../../public/carousel_2.png";
import Carousel3 from "../../public/carousel_3.png";
export default function Carousel() {
  return (
    <>
      <div className="carousel w-full ">
        <div id="item1" className="carousel-item w-full ">
          {/* <img src="../../public/carousel_1.jpeg" className="w-full" /> */}
          <Image
            src={Carousel1}
            // layout=""
            alt="carousel-1"
            className="w-full"
          />
        </div>
        <div id="item2" className="carousel-item w-full">
          <Image
            src={Carousel2}
            // layout=""
            alt="carousel-2"
            className="w-full"
          />
        </div>
        <div id="item3" className="carousel-item w-full">
          <Image
            src={Carousel3}
            // layout=""
            alt="carousel-3"
            className="w-full"
          />
        </div>
      </div>
      <div className="flex justify-center w-full py-2 gap-2">
        <a href="#item1" className="btn btn-xs">
          1
        </a>
        <a href="#item2" className="btn btn-xs">
          2
        </a>
        <a href="#item3" className="btn btn-xs">
          3
        </a>
      </div>
    </>
  );
}
