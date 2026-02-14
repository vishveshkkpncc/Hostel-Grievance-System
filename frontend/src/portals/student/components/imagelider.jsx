import { useEffect, useState } from "react";
import "../styles/imageSlider.css";

const images = [
  "https://vnit.ac.in/section/hostel/wp-content/uploads/2025/08/Kalpana-chawla-scaled.jpg",
  "https://vnit.ac.in/section/hostel/wp-content/uploads/2025/08/Anandi-Gopal-Joshi-scaled.jpg",
  "https://vnit.ac.in/section/hostel/wp-content/uploads/2025/08/M-S-SWAMINATHAN-scaled.jpg",
  "https://vnit.ac.in/section/hostel/wp-content/uploads/2025/08/V-G-BHIDE-scaled.jpg",
  "https://vnit.ac.in/section/hostel/wp-content/uploads/2025/08/Meghnad-Saha-scaled.jpg",
  "https://vnit.ac.in/section/hostel/wp-content/uploads/2025/08/aryabhatta-scaled.jpg",
  "https://vnit.ac.in/section/hostel/wp-content/uploads/2025/08/S-RAMANUJAN-scaled.jpg",
  "https://vnit.ac.in/section/hostel/wp-content/uploads/2025/08/APJ-scaled.jpg",
  "https://vnit.ac.in/section/hostel/wp-content/uploads/2025/08/C-V-RAMAN-scaled.jpg",
  "https://vnit.ac.in/section/hostel/wp-content/uploads/2025/08/homi-bhabha-scaled.jpg",
  "https://vnit.ac.in/section/hostel/wp-content/uploads/2025/08/VS-scaled.jpg",
];

function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      <div
        className="slider-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <img src={img} key={index} alt="Hostel" />
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;