import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import CivilComplaints from './CivilComplaints'; 
import ElectricalComplaints from './ElectricalComplaints'; 
import LanComplaints from './LanComplaints'; 
import UpdateComplaint from './UpdateComplaint'; 

function App() {
  return (
    <BrowserRouter>
       <Routes>
         <Route path="/" element={<Home/>} />
         <Route path="/civil" element={<CivilComplaints/>} />
         <Route path="/electrical" element={<ElectricalComplaints/>} />
         <Route path="/lan" element={<LanComplaints/>} />
         <Route path="/update-complaint/:type/:id" element={<UpdateComplaint/>} />
       </Routes>
    </BrowserRouter>
  );
}

export default App;
