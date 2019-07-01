import React from 'react';
import './App.css';
import PodcastSearchContainer from "./components/PodcastSearchContainer";
import AppRouter from "./AppRouter";

function App() {
  return (
    <div className="App">
      {/*<PodcastSearchContainer />*/}
      <AppRouter/>
    </div>
  );
}

export default App;
