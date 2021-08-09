import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import logo from "../tgen-coh.png";

function Header() {
  return (
    <div>
      <Navbar sticky="top" bg="light" variant="light">
        <Navbar.Brand href="home">
          <img
            src={logo}
            height="40"
            className="d-inline-block align-center mr-3"
            alt="Epitools Logo"
          />{" "}
          One Health Genomic Epi Tools
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="home">Home</Nav.Link>
          <Nav.Link href="project1">Project 1</Nav.Link>
          <Nav.Link href="project2">Project 2</Nav.Link>
          <NavDropdown title="Component Demo">
            <NavDropdown.Item href="demo-phylocanvas">Phylocanvas</NavDropdown.Item>
            <NavDropdown.Item href="demo-leaflet">Leaflet</NavDropdown.Item>
            <NavDropdown.Item href="demo-plotly">Plotly</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
    </div>
  )
}

export default Header;
