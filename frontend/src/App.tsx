import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import { SettingProvider } from './context/SettingProvider';
import Home from './pages/home/Home';
import Setting from './pages/setting/Setting';

function App() {
  return (
    <SettingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </Router>
    </SettingProvider>
  );
}

export default App;
