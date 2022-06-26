import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Login from './Pages/Login/Login';
import Reminders from './Pages/Reminders/Reminders.js';
import Rentals from './Pages/Rentals/Rentals';
import Repairs from './Pages/Repairs/Repairs';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Login/>} />
      <Route element={<ProtectedRoute />}>
        <Route path="/Reminders" element={<Reminders />}></Route>
        <Route path="/Rentals" element={<Rentals />}></Route>
        <Route path="/Repairs" element={<Repairs />}></Route>
      </Route>
    </Routes>
  );
}

export default App;