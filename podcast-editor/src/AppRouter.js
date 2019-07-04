import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import PodcastSearchContainer from "./components/PodcastSearchContainer";
import PodcastEditContainer from "./components/PodcastEditContainer";

function AppRouter() {
  return (
    <Router>
      <div>
        <Route path="/" exact component={PodcastSearchContainer} />
        <Route path="/edit" component={PodcastEditContainer} />
      </div>
    </Router>
  );
}

export default AppRouter;
