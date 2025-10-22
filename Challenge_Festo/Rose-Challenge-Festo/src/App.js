import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Banner from 'components/Banner';

import WelcomePage from 'components/WelcomePage';
import SelectModel from 'components/SelectModel';
import ActuatorDsnuDisplay from 'components/DSNU';
import ActuatorDsbcDisplay from 'components/DSBC';

export default function App() {
  return (
    <BrowserRouter>
      <Banner />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/select" element={<SelectModel />} />
        <Route path="/dsnu" element={<ActuatorDsnuDisplay />} />
        <Route path="/dsbc" element={<ActuatorDsbcDisplay />} />
      </Routes>
    </BrowserRouter>
  );
}

