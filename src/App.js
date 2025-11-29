/** @format */

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './component/Login'
import { Notification } from './component/Notification';
import { Home } from './component/Home';


import ProductComponent from './component/ProductComponent';

import UserList from './services/UserList';
import RegisterPage from './component/RegisterPage';
import DetectorList from './services/DetectorList';
import LinkDetector from './component/LinkDetector';
import UserGasDashboard from './component/UserGasDashboard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/detector" element={<DetectorList />} />
          <Route path="/link-detector" element={<LinkDetector />} />
          <Route path="/user/dashboard" element={<UserGasDashboard />} />
          <Route path="/product" element={<ProductComponent />} />
          <Route path="/login" element={<Login />} />
          <Route exact path="/home" element={<Home />} />{' '}
          <Route path="/users/service" element={<UserList />} />
          <Route path="/user/linkdetector" element={<LinkDetector />} />
      <Route path="/register" element={<RegisterPage />} />

        </Routes>
      </BrowserRouter>
      ,
    </div>
  );
}

export default App;
