import React, { useState } from "react";
import { useSearchParams } from "react-router-dom"
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./nav/Header.js";
import Body from "./nav/Body.js";
import Footer from "./nav/Footer.js";
import RequestPathogenList from "./requests/RequestPathogenList";

function App() {
  const [pathogenList, setPathogenList] = useState();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="App">
      {/* upon header load, immediately get a list of pathogen types from the DB */}
      <RequestPathogenList
        setPathogenList = {setPathogenList}
      />
      <Header
        pathogenList = {pathogenList}
        searchParams = {searchParams}
        setSearchParams = {setSearchParams}
      />
      <Body
        pathogenList = {pathogenList}
        searchParams = {searchParams}
        setSearchParams = {setSearchParams}
      />
      <Footer />
    </div>
  );
}

export default App;
