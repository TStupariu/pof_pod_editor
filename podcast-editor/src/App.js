import React from 'react';
import './App.css';
import AppRouter from "./AppRouter";
import * as firebase from "firebase";
import {firebaseConfig} from "./config";

function App() {
  firebase.initializeApp(firebaseConfig)

  return (
    <div className="App">
      <AppRouter/>
    </div>
  );
}

export default App;
