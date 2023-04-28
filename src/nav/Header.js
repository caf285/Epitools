import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../tgen-coh.png";
import "./Nav.css";
import RequestPathogenList from "./RequestPathogenList";

function Header(props) {
  // demo loaded on localhost only
  const [demoNav, setDemoNav] = useState();
  useEffect(() => {
    if (window.location.hostname === "localhost" || window.location.hostname === "10.55.16.53") {
      setDemoNav(
        <NavDropdown title="Component Demo">
          <NavDropdown.Item href="/epitools/demo-phylocanvas/">Phylocanvas</NavDropdown.Item>
          <NavDropdown.Item href="/epitools/demo-leaflet/">Leaflet</NavDropdown.Item>
          <NavDropdown.Item href="/epitools/demo-plotly/">Plotly</NavDropdown.Item>
          <NavDropdown.Item href="/epitools/demo-mysql/">React MySQL</NavDropdown.Item>
          <NavDropdown.Item href="/epitools/demo-handsontable/">React HandsOnTable</NavDropdown.Item>
        </NavDropdown>
      )
    }
  }, [])

  // populates with pathogen types from DB query
  const [pathogenTypeList, setPathogenTypeList] = useState();

  // populates with pathogen types converted to Nav.Dropdown.Items
  const [pathogenDropdown, setPathogenDropdown] = useState();
  useEffect(() => {
    if (pathogenTypeList) {
      let newPathogenDropdown = []
      props.setPathogenType(pathogenTypeList[0])
      for (let line of pathogenTypeList) {
        newPathogenDropdown.push(<NavDropdown.Item onClick={() => {props.setPathogenType(line)}}>{line}</NavDropdown.Item>)
      }
      setPathogenDropdown(newPathogenDropdown)
    }
  }, [pathogenTypeList])

  // pathogen button

  return (
    <div className="Nav-header">

      {/* upon header load, immediately get a list of pathogen types from the DB */}
      <RequestPathogenList
        setPathogenTypeList = {setPathogenTypeList}
      />

      <Navbar sticky="top" bg="light" variant="light">
        <Navbar.Brand href="/epitools/home/">
          <img
            src={logo}
            height="50"
            className="d-inline-block align-center mr-3"
            alt="Epitools Logo"
          />{" "}
          One Health Genomic Epi Tools
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="/epitools/home/">Home</Nav.Link>
          <Nav.Link href="/epitools/home/">Epitools</Nav.Link>
          <NavDropdown title={props.pathogenType ? "Pathogen (" + props.pathogenType + ")" : "Pathogen"}>
            {pathogenDropdown}
          </NavDropdown>
          {demoNav}
        </Nav>
      </Navbar>
    </div>
  )
}

export default Header;
