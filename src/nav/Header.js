import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../tgen-coh.png";

function Header() {
  return (
    <div className="Nav-header">
      <Navbar sticky="top" bg="light" variant="light">
        <Navbar.Brand href="home">
          <img
            src={logo}
            height="60"
            className="d-inline-block align-center mr-3"
            alt="Epitools Logo"
          />{" "}
          One Health Genomic Epi Tools
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="home">Home</Nav.Link>
          <Nav.Link href="gas">GAS</Nav.Link>
          <NavDropdown title="Component Demo">
            <NavDropdown.Item href="demo-phylocanvas">Phylocanvas</NavDropdown.Item>
            <NavDropdown.Item href="demo-leaflet">Leaflet</NavDropdown.Item>
            <NavDropdown.Item href="demo-plotly">Plotly</NavDropdown.Item>
            <NavDropdown.Item href="demo-mysql">React MySQL</NavDropdown.Item>
            <NavDropdown.Item href="demo-handsontable">React HandsOnTable</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
    </div>
  )
}

export default Header;
