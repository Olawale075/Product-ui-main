/** @format */

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './component/auth/Login'
import { Notification } from './component/Notification';
import { Home } from './component/Home';
import Templates from './component/Templates';
import Template from './component/Template';
import NewTemplate from './component/NewTemplate';
import DeliveryReport from './component/Report';
import Variable from './component/Variable';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/new-template" element={<NewTemplate />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/:id" element={<Template />} />
          <Route path="/report" element={<DeliveryReport />} />
          <Route path="/login" element={<Login />} />
          <Route exact path="/home" element={<Home />} />{' '}
          <Route path="/variables" element={<Variable />} />
        </Routes>
      </BrowserRouter>
      ,
    </div>
  );
}

export default App;
