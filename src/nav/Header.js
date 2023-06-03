import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../tgen-coh.png";
import "./Nav.css";

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

  // populates with pathogen types converted to Nav.Dropdown.Items
  const [pathogenDropdown, setPathogenDropdown] = useState();
  useEffect(() => {
    if (props.pathogenTypeList && props.pathogenTypeList.length > 1) {
      props.searchParams.set("pathogen", props.pathogenTypeList[0])
      props.setSearchParams(props.searchParams)
      setPathogenDropdown(props.pathogenTypeList.map((v, k) => {return <NavDropdown.Item key={k} onClick={() => {
        props.searchParams.set("pathogen", v)
        props.setSearchParams(props.searchParams)
      }}>{v}</NavDropdown.Item>}))
    }
  }, [props.pathogenTypeList])

  // pathogen button

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
          <NavDropdown title={props.searchParams.get("pathogen") ? "Pathogen (" + props.searchParams.get("pathogen") + ")" : "Pathogen"}>
            {pathogenDropdown}
          </NavDropdown>
          {demoNav}
        </Nav>
      </Navbar>
    </div>
  )
}

export default Header;
