import { useEffect } from "react";
import MainPanel from "./mainPanel";
import "../styles/dashboard.css";
import ImageSlider from "./imagelider";

export default function Dashboard() {
  return (
    <>
    <div className="dashboard-container">
      <div className="slider-section">
        <div className="hostel-image">
          <ImageSlider/>
        </div>
      </div>
      <div className="cards-section">
        <MainPanel/>
      </div>
    </div>
    
    </>
  );
}