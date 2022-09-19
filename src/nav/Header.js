import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../tgen-coh.png";
import "./Nav.css";

function Header() {
  if (window.location.hostname === "localhost" || window.location.hostname === "10.55.16.53") {
    return (
      <div className="Nav-header">
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
            <NavDropdown title="Component Demo">
              <NavDropdown.Item href="/epitools/demo-phylocanvas/">Phylocanvas</NavDropdown.Item>
              <NavDropdown.Item href="/epitools/demo-leaflet/">Leaflet</NavDropdown.Item>
              <NavDropdown.Item href="/epitools/demo-plotly/">Plotly</NavDropdown.Item>
              <NavDropdown.Item href="/epitools/demo-mysql/">React MySQL</NavDropdown.Item>
              <NavDropdown.Item href="/epitools/demo-handsontable/">React HandsOnTable</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar>
      </div>
    )
  }
  else {
    return (
      <div className="Nav-header">
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
          </Nav>
        </Navbar>
      </div>
    )
  }
}

export default Header;
