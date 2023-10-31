import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Carousel({
  autoSlide = false,
  autoSlideInterval = 3000,
  slides,
  height,
  object
}: {
  autoSlide?: boolean;
  autoSlideInterval?: number;
  slides: string[];
  height: string;
  object?: string;
}) {
  const [curr, setCurr] = useState(0);

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="overflow-hidden relative bg-[#ECC8AF] flex flex-column">
      <div
        className="flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides?.map((img) => (
          <img src={img} alt="" className={`min-w-full ${object} ${height}`} />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={prev}
          className="p-1 rounded-full shadow bg-white/70 text-gray-800 hover:bg-white"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={next}
          className="p-1 rounded-full shadow bg-white/70 text-gray-800 hover:bg-white"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {slides?.map((_, i) => (
            <div
              className={`
              transition-all w-2 h-2 bg-white rounded-full
              ${curr === i ? "p-1" : "bg-opacity-50"}
            `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}