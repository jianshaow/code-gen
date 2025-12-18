import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import Home from './pages/home/Home';
import Setting from './pages/setting/Setting';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </Router>
  );
}

export default App;
