import React, { useState, useEffect, useCallback } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../tgen-coh.png";
import "./Nav.css";

function Header(props) {
  // destructure props
  const pathogenList = props.pathogenList
  const searchParams = props.searchParams
  const setSearchParams = props.setSearchParams

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
  const setPathogenDropdownCallback = useCallback(() => {
    if (pathogenList && pathogenList.length > 1) {
      setPathogenDropdown(pathogenList.map((v, k) => {return <NavDropdown.Item key={k} onClick={() => {
        searchParams.set("pathogen", v)
        setSearchParams(searchParams)
      }}>{v}</NavDropdown.Item>}))
    }
  }, [pathogenList, searchParams, setSearchParams])

  useEffect(() => {
    setPathogenDropdownCallback()
  }, [pathogenList, setPathogenDropdownCallback])

  // pathogen button

  return (
    <div className="Nav-header">
      <Navbar sticky="top" bg="light" variant="light">
        <Navbar.Brand href="/epitools/home/">
          <div style={{ display: "flex", flexFlow: "row" }}>
            <img
              src={logo}
              height="50"
              className="d-inline-block align-center mr-3"
              alt="Epitools Logo"
            />{" "}
            <span>One Health Genomic Epi Tools</span>
          </div>
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
