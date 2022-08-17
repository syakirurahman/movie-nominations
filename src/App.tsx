// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Movies from './pages/movies/Movies';
import './App.scss'

function App() {

  return (
    <div className="app-wrapper">
      <div className='app-header'>
        <h1>IMDB Movie Nominations.</h1>
      </div>
      <Router>
          <Routes>
            <Route element={<Movies />} index />
            <Route element={<Movies />} path="/employees" />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
