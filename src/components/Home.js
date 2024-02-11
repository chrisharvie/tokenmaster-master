import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

//Importing css
import "../App.css";
// Components
import Card from "./Card";
import SeatChart from "./SeatChart";

// ABIs
import Artick from "../abis/Artick.json";

// Config
import config from "../config.json";

//Importing ethers library
const ethers = require("ethers");

function Home() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [artick, setArtick] = useState(null);
  const [occasions, setOccasions] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [occasion, setOccasion] = useState({});

  const loadBlockchainData = async () => {
    //provides the blockchain connection
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    //for changing networks instead of hardhat
    const network = await provider.getNetwork();
    //create connection for smart contract for javascript
    const address = config[31337].Artick.address;
    const artick = new ethers.Contract(address, Artick, provider);
    setArtick(artick);
    const totalOccasions = await artick.totalOccasions();

    const occasions = [];

    for (var i = 1; i <= totalOccasions; i++) {
      console.log("count");
      const occasion = await artick.getOccasion(i);
      occasions.push(occasion);
    }

    setOccasions(occasions);
    //requires metamask to open and connect
    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  // MetaMask Login/Connect, connects account
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    //sets the variable to the account which is then used in the Navbar
    setAccount(accounts[0]);
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Set signer
    const signer = provider.getSigner();

    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async function (accounts) {
      setAccount(accounts[0]);
      await web3Handler();
    });
  };

  return (
    <div className="App">
      <main className="page-wrapper">
        <section
          className="bg-dark bg-size-cover bg-repeat-0 bg-position-center position-relative overflow-hidden py-5 mb-4"
          style={{
            backgroundImage:
              'url("assets/img/landing/saas-3/hero/hero-bg.jpg")',
          }}
          data-bs-theme="dark"
        >
          <div className="container position-relative zindex-2 pt-5 pb-md-2 pb-lg-4 pb-xl-5">
            <div className="row pt-3 pb-2 py-md-4">
              <div className="col-xl-5 col-md-6 pt-lg-5 text-center text-md-start mb-4 mb-md-0">
                <h1 className="display-3 pb-2 pb-sm-3">
                  Buy and sell tickets here with Artick
                </h1>
                <p className="text-body fs-lg d-md-none d-xl-block pb-2 pb-md-0 mb-4 mb-md-5">
                  Improving life's experiences.
                </p>
                <div className="d-flex justify-content-center justify-content-md-start pb-2 pt-lg-2 pt-xl-0">
                  <a
                    href="#"
                    className="btn btn-lg btn-primary shadow-primary me-3 me-sm-4"
                  >
                    Find tickets
                  </a>
                  <a href="#" className="btn btn-lg btn-outline-secondary">
                    Sell tickets
                  </a>
                </div>
              </div>

              <div className="col-xl-7 col-md-6 d-md-flex justify-content-end">
                <div
                  className="parallax mx-auto ms-md-0 me-md-n5"
                  style={{ maxWidth: "675px" }}
                >
                  <div className="parallax-layer zindex-2" data-depth="0.1">
                    <img
                      src="assets/img/landing/saas-3/hero/fred-again-big.jpg"
                      alt="Card"
                    ></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-lg-5 py-md-4 py-3">
          <h2 className="h1 mb-md-4 mb-3 mt-0">Popular tickets</h2>

          <div
            className="swiper mb-xl-3"
            data-swiper-options='{
"spaceBetween": 24,
"breakpoints": {
 "0": {
   "slidesPerView": 1
 },
 "768": {
   "slidesPerView": 2
 }
},
"pagination": {
 "el": ".swiper-pagination",
 "clickable": true
}
}'
          >
            <div className="swiper-wrapper">
              <div className="swiper-slide h-auto">
                <div className="cards">
                  {occasions.map((occasion, index) => (
                    <Card
                      occasion={occasion}
                      id={index + 1}
                      artick={artick}
                      provider={provider}
                      account={account}
                      toggle={toggle}
                      setToggle={setToggle}
                      setOccasion={setOccasion}
                      key={index}
                      className="card"
                    />
                  ))}
                </div>

                {toggle && (
                  <SeatChart
                    occasion={occasion}
                    artick={artick}
                    provider={provider}
                    setToggle={setToggle}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer
        className="footer pt-4 pb-4 pb-lg-5"
        style={{
          backgroundImage: 'url("assets/img/landing/saas-3/hero/hero-bg.jpg")',
        }}
        data-bs-theme="dark"
      >
        <div className="container pt-lg-4">
          <div className="row pb-5">
            <div className="col-lg-4 col-md-6">
              <div className="navbar-brand text-dark p-0 me-0 mb-3 mb-lg-4">
                <img
                  src="assets/img/Transparent Logo.png"
                  width="125"
                  alt="Silicon"
                />
              </div>
              <form className="needs-validation" noValidate>
                <label htmlFor="subscr-email" className="form-label">
                  Subscribe to our newsletter
                </label>
                <div className="input-group">
                  <input
                    type="email"
                    id="subscr-email"
                    className="form-control rounded-start ps-5"
                    placeholder="Your email"
                    required
                  />
                  <i className="bx bx-envelope fs-lg text-muted position-absolute top-50 start-0 translate-middle-y ms-3 zindex-5"></i>
                  <div className="invalid-tooltip position-absolute top-100 start-0">
                    Please provide a valid email address.
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
            <div className="col-xl-6 col-lg-7 col-md-5 offset-xl-2 offset-md-1 pt-4 pt-md-1 pt-lg-0">
              <div id="footer-links" className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">
                    <a
                      href="#useful-links"
                      className="d-block text-dark dropdown-toggle d-lg-none py-2"
                      data-bs-toggle="collapse"
                    >
                      Useful Links
                    </a>
                  </h6>
                  <div
                    id="useful-links"
                    className="collapse d-lg-block"
                    data-bs-parent="#footer-links"
                  >
                    <ul className="nav flex-column pb-lg-1 mb-lg-3">
                      <li className="nav-item">
                        <a
                          href="#"
                          className="nav-link d-inline-block px-0 pt-1 pb-2"
                        >
                          Home
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#"
                          className="nav-link d-inline-block px-0 pt-1 pb-2"
                        >
                          Marketplace
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#"
                          className="nav-link d-inline-block px-0 pt-1 pb-2"
                        >
                          About us
                        </a>
                      </li>
                    </ul>
                    <ul className="nav flex-column mb-2 mb-lg-0">
                      <li className="nav-item">
                        <a
                          href="#"
                          className="nav-link d-inline-block px-0 pt-1 pb-2"
                        >
                          Terms &amp; Conditions
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#"
                          className="nav-link d-inline-block px-0 pt-1 pb-2"
                        >
                          Privacy Policy
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-3">
                  <h6 className="mb-2">
                    <a
                      href="#social-links"
                      className="d-block text-dark dropdown-toggle d-lg-none py-2"
                      data-bs-toggle="collapse"
                    >
                      Socials
                    </a>
                  </h6>
                  <div
                    id="social-links"
                    className="collapse d-lg-block"
                    data-bs-parent="#footer-links"
                  >
                    <ul className="nav flex-column mb-2 mb-lg-0">
                      <li className="nav-item">
                        <a
                          href="#"
                          className="nav-link d-inline-block px-0 pt-1 pb-2"
                        >
                          LinkedIn
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#"
                          className="nav-link d-inline-block px-0 pt-1 pb-2"
                        >
                          X
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#"
                          className="nav-link d-inline-block px-0 pt-1 pb-2"
                        >
                          Instagram
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-5 pt-2 pt-lg-0">
                  <h6 className="mb-2">Contact Us</h6>
                  <a href="mailto:email@example.com" className="fw-medium">
                    Artick@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
          <p className="nav d-block fs-xs text-center text-md-start pb-2 pb-lg-0 mb-0">
            &copy; All rights reserved. Made by
            <a
              className="nav-link d-inline-block p-0"
              href="https://createx.studio/"
              target="_blank"
              rel="noopener"
            >
              Createx Studio
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
