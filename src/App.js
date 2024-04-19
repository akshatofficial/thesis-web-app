import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import SideDrawer from './components/SideDrawer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Prediction from './Pages/Prediction';

export default function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <BrowserRouter>
        <SideDrawer />
        <Routes>
          <Route path="/predict" element={<Prediction />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}
