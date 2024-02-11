import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";

import { ethers } from "ethers";

const Navigation = ({ account, web3Handler }) => {
  return (
    <div>
      <header className="header navbar navbar-expand-lg navbar-dark position-absolute">
        <div className="container px-3">
          <a href="index.html" className="navbar-brand pe-3">
            <img
              src="assets/img/Transparent Logo.png"
              width="110"
              alt="Artick"
            />
          </a>
          <div id="navbarNav" className="offcanvas offcanvas-end bg-dark">
            <div className="offcanvas-header border-bottom border-light">
              <h5 className="offcanvas-title text-white">Menu</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>

            <div className="offcanvas-body">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <form className="d-flex" style={{ paddingLeft: "40px" }}>
                    <input
                      className="form-control me-2 pl-2"
                      type="search"
                      placeholder="Search for events..."
                      aria-label="Search"
                      style={{ width: "240px", marginTop: "20px" }}
                    />
                  </form>
                </li>
                <div className="nav-bar">
                  <Navbar data-bs-theme="dark">
                    <Nav className="me-auto" style={{ paddingLeft: "40px" }}>
                      <Nav.Link as={Link} to="/home">
                        Home
                      </Nav.Link>
                      <Nav.Link as={Link} to="/create">
                        Create
                      </Nav.Link>
                      <Nav.Link as={Link} to="/my-purchases">
                        My purchases
                      </Nav.Link>
                      <Nav.Link as={Link} to="/my-listed-tickets">
                        My listed tickets
                      </Nav.Link>
                      <Nav.Link as={Link} to="/about">
                        About
                      </Nav.Link>
                    </Nav>
                  </Navbar>
                </div>
              </ul>
            </div>

            <div className="offcanvas-header border-top border-light">
              {account ? (
                <a
                  href={`https://etherscan.io/address/${account}`}
                  className="btn btn-primary w-100"
                  target="_blank"
                  rel="noopener"
                >
                  <i className="bx bx-cart fs-4 lh-1 me-1"></i>
                  &nbsp; {account.slice(0, 5) + "..." + account.slice(38, 42)}
                </a>
              ) : (
                <a>
                  <i
                    className="bx bx-cart fs-4 lh-1 me-1"
                    onClick={web3Handler}
                  ></i>
                  &nbsp; Connect Wallet
                </a>
              )}
            </div>
          </div>

          <button
            type="button"
            className="navbar-toggler"
            data-bs-toggle="offcanvas"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {account ? (
            <a
              href={`https://etherscan.io/address/${account}`}
              className="btn btn-primary btn-sm fs-sm rounded d-none d-lg-inline-flex"
              target="_blank"
              rel="noopener"
            >
              <i className="bx bx-cart fs-5 lh-1 me-1"></i>
              &nbsp; {account.slice(0, 5) + "..." + account.slice(38, 42)}
            </a>
          ) : (
            <i className="bx bx-cart fs-5 lh-1 me-1" onClick={web3Handler}>
              &nbsp; Connect Wallet
            </i>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navigation;
