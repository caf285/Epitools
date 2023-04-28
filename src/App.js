import React, { useState } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./nav/Header.js";
import Body from "./nav/Body.js";
import Footer from "./nav/Footer.js";

function App() {
  const [pathogenType, setPathogenType] = useState();

  return (
    <div className="App">
      <Header
        pathogenType = {pathogenType}
        setPathogenType = {setPathogenType}
      />
      <Body
        pathogenType = {pathogenType}
      />
      <Footer />
    </div>
  );
}

export default App;
