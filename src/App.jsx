import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MapCurriculum from "./pages/MapCurriculum";
import UploadCurriculum from "./pages/UploadCurriculum";
import MainLayout from "./layouts/MainLayout";

function APP(){
  return(
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapCurriculum />} />
          <Route path="/upload" element={<UploadCurriculum />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default APP;