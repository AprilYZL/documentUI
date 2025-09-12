import './App.css'
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import UploadInsuranceFiles from './pages/UploadInsuranceFiles'
import Gallery from './pages/Gallery';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadInsuranceFiles />} />       
        <Route path="/gallery" element={<Gallery />} /> 
      </Routes>
    </Router>
  );
}


export default App
