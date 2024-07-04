import React from "react";
import {
  BrowserRouter as Router, Route, Routes 
} from "react-router-dom";
import { HomeScreen } from "./Pages";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Screens */}
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
