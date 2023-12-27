import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { WEB_APP_ROUTES } from "../config/constants/Routes";
import "./Navbar.css"
import { resetState } from "../redux/slices/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
function MainNavbar() {
  const user_info_reducer = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onLogout = () => {
    dispatch(resetState());
    navigate("/", { replace: true });
  };
  console.log("user_info_reducer",user_info_reducer)
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href={WEB_APP_ROUTES.HOME}>DeepTrade</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link  href={WEB_APP_ROUTES.MONITORING}>Monitoring</Nav.Link>
            <Nav.Link href={WEB_APP_ROUTES.BACKTEST}>Backtest</Nav.Link>
            <Nav.Link  href={WEB_APP_ROUTES.RESULTS}>Result</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/" onClick={()=>{onLogout()}}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;
