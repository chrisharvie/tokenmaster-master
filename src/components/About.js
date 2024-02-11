import "../App.css";
import { useEffect, useState } from "react";
const ethers = require("ethers");

function About() {
  const [account, setAccount] = useState(null);

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
    <div>
      <section
        className="position-relative bg-dark pt-lg-4 pt-xl-5"
        style={{
          background:
            "linear-gradient(90deg, #0B0F19 0%, #172033 51.04%, #0B0F19 100%)",
        }}
      >
        <div
          className="jarallax position-absolute top-0 start-0 w-100 h-100"
          data-jarallax
          data-speed="0.4"
        >
          <div
            className="jarallax-img"
            style={{
              backgroundImage:
                'url("/assets/img/landing/saas-5/hero-bg-pattern.png")',
            }}
          ></div>
        </div>
        <div className="container position-relative zindex-2 pt-2 pt-sm-4 pt-md-5">
          <div className="row justify-content-center pt-5">
            <div className="col-lg-9 col-xl-8 text-center pt-5 mt-1">
              <h1 className="display-4 text-white pt-3 mt-3 mb-4">
                Disrupting the legacy ticketing ecosystem
              </h1>
              <p className="text-white opacity-70 fs-xl">
                We use blockchain technology to bring decentralization to the
                ticketing industry. Removing middle men and fraudsters we make
                it easier for fans to go to their favourite events.
              </p>
            </div>
          </div>
        </div>
        <div className="d-lg-block" style={{ height: "480px" }}></div>

        <div
          className="d-flex position-absolute bottom-0 start-0 w-100 overflow-hidden mb-n1"
          style={{ color: "var(--si-body-bg)" }}
        >
          <div
            className="position-relative start-50 translate-middle-x flex-shrink-0"
            style={{ width: "3774px" }}
          >
            <svg
              width="3774"
              height="201"
              viewBox="0 0 3774 201"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 200.003C0 200.003 1137.52 0.188224 1873.5 0.000134392C2614.84 -0.189325 3774 200.003 3774 200.003H0Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </section>

      {/*this is the main content for this page */}
      <section className="container position-relative zindex-3">
        <div
          className="dclassName d-lg-block"
          style={{ marginTop: "-428px" }}
        ></div>
        <div className=" d-lgclassName" style={{ marginTop: "-370px" }}></div>
        <div
          className="swiper"
          data-swiper-options='{
    "slidesPerView": 1,
    "spaceBetween": 24,
    "pagination": {
      "el": ".swiper-pagination",
      "clickable": true
    },
    "breakpoints": {
      "560": {
        "slidesPerView": 2
      },
      "960": {
        "slidesPerView": 3
      }
    }
  }'
        >
          <div className="swiper-wrapper">
            {/*Item*/}
            <div
              className="swiper-slide"
              style={{ height: "350px", width: "400px" }}
            >
              <a
                href="#"
                className="card-portfolio position-relative d-block rounded-3 overflow-hidden"
              >
                <span
                  className="position-absolute top-0 start-0 w-100 h-100 zindex-1"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(17, 24, 39, 0.00) 35.56%, #111827 95.3%)",
                  }}
                ></span>
                <div className="position-absolute bottom-0 w-100 zindex-2 p-4">
                  <div className="px-md-3">
                    <h3 className="h4 text-white mb-0">
                      Fiat currency payments
                    </h3>
                    <div className="card-portfolio-meta d-flex align-items-center justify-content-between">
                      <span className="text-white fs-xs text-truncate opacity-70 pe-3">
                        Pay using your regular bank cards
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-img h-100" style={{ height: "350px" }}>
                  <img
                    src="/assets/img/landing/saas-5/categories/ecommerce.jpg"
                    alt="Ecommerce"
                    style={{ height: "350px", width: "365px" }}
                  />
                </div>
              </a>
            </div>

            {/*Item*/}
            <div
              className="swiper-slide"
              style={{ height: "350px", width: "400px" }}
            >
              <a
                href="#"
                className="card-portfolio position-relative d-block rounded-3 overflow-hidden"
              >
                <span
                  className="position-absolute top-0 start-0 w-100 h-100 zindex-1"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(17, 24, 39, 0.00) 35.56%, #111827 95.3%)",
                  }}
                ></span>
                <div className="position-absolute bottom-0 w-100 zindex-2 p-4">
                  <div className="px-md-3">
                    <h3 className="h4 text-white mb-0">Easy to use</h3>
                    <div className="card-portfolio-meta d-flex align-items-center justify-content-between">
                      <span className="text-white fs-xs text-truncate opacity-70 pe-3">
                        A simple solution everyone can use
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-img h-100" style={{ height: "350px" }}>
                  <img
                    src="/assets/img/qr-code.jpg"
                    alt="Transportation"
                    style={{ height: "350px", width: "365px" }}
                  />
                </div>
              </a>
            </div>

            {/*Item*/}
            <div
              className="swiper-slide"
              style={{ height: "350px", width: "400px" }}
            >
              <a
                href="#"
                className="card-portfolio position-relative d-block rounded-3 overflow-hidden"
              >
                <span
                  className="position-absolute top-0 start-0 w-100 h-100 zindex-1"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(17, 24, 39, 0.00) 35.56%, #111827 95.3%)",
                  }}
                ></span>
                <div className="position-absolute bottom-0 w-100 zindex-2 p-4">
                  <div className="px-md-3">
                    <h3 className="h4 text-white mb-0">Fan to fan</h3>
                    <div className="card-portfolio-meta d-flex align-items-center justify-content-between">
                      <span className="text-white fs-xs text-truncate opacity-70 pe-3">
                        No middle men or fraudsters in the way
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-img h-100" style={{ height: "350px" }}>
                  <img
                    src="/assets/img/peer-to-peer.jpg"
                    alt="Marketing"
                    style={{ height: "350px" }}
                  />
                </div>
              </a>
            </div>
          </div>

          {/*Pagination (bullets)*/}
          <div className="swiper-pagination position-relative bottom-0 pt-2 pt-md-3 mt-4"></div>
        </div>
      </section>
      <div
        style={{
          backgroundImage: "url(assets/img/landing/saas-3/hero/hero-bg.jpg)",
        }}
      >
        <section className="container text-center py-2">
          <h1
            className="display-4"
            style={{ fontSize: "3rem", color: "white", marginTop: "100px" }}
          >
            The benefits of our platform
          </h1>
        </section>

        {/*Main features (Slider on narrow screens)*/}
        <section className="container pt-1 pb-xl-5">
          <div
            className="swiper mt-n3 mt-md-0 pt-md-3 pt-lg-4 mx-n2"
            data-swiper-options='{
          "slidesPerView": 1,
          "spaceBetween": 8,
          "pagination": {
            "el": ".swiper-pagination",
            "clickable": true
          },
          "navigation": {
            "prevEl": "#prev-news",
            "nextEl": "#next-news"
          },
          "breakpoints": {
            "500": {
              "slidesPerView": 2
            },
            "700": {
              "slidesPerView": 3
            },
            "1000": {
              "slidesPerView": 4
            }
          }
        }'
          >
            <div className="swiper-wrapper">
              {/* Item */}
              <div className="swiper-slide h-auto pb-3">
                <div
                  className=" d-block card card-hover bg-light border-0 animation-on-hover h-100 mx-2"
                  style={{ width: "300px" }}
                >
                  <lottie-player
                    className="d-block d-dark-mode-block mx-auto mt-4 mb-2"
                    src="assets/json/animation-feature-1-dark.json"
                    background="transparent"
                    speed="1.25"
                    loop={true}
                  ></lottie-player>
                  <div className="card-body fs-lg fw-semibold text-center">
                    Highly transparent transactions
                  </div>
                </div>
              </div>

              {/* Item */}
              <div className="swiper-slide h-auto pb-3">
                <div
                  className=" d-block card card-hover bg-light border-0 animation-on-hover h-100 mx-2"
                  style={{ width: "300px" }}
                >
                  <lottie-player
                    className="d-block d-dark-modeclassName mx-auto mt-4 mb-2"
                    src="assets/json/animation-feature-2-dark.json"
                    background="transparent"
                    speed="1.25"
                    loop={true}
                  ></lottie-player>

                  <div className="card-body fs-lg fw-semibold text-center">
                    Lower 'admin' fee's to middle men
                  </div>
                </div>
              </div>

              {/* Item */}
              <div className="swiper-slide h-auto pb-3">
                <div className=" d-block card card-hover bg-light border-0 animation-on-hover h-100 mx-2">
                  <lottie-player
                    className="d-block d-dark-modeclassName mx-auto mt-4 mb-2"
                    src="assets/json/animation-feature-3-light.json"
                    background="transparent"
                    speed="1.25"
                    loop={true}
                    style={{ width: "180px" }}
                  ></lottie-player>

                  <div className="card-body fs-lg fw-semibold text-center">
                    Innovative technology
                  </div>
                </div>
              </div>

              {/* Item */}
              <div className="swiper-slide h-auto pb-3">
                <div className="d-block card card-hover bg-light border-0 animation-on-hover h-100 mx-2">
                  <lottie-player
                    className="d-dark-modeclassName mx-auto mt-4 mb-2"
                    src="assets/json/animation-feature-4-light.json"
                    background="transparent"
                    speed="1.25"
                    loop={true}
                    style={{ width: "180px" }}
                  ></lottie-player>
                  <lottie-player
                    className="d-block d-dark-mode-block mx-auto mt-4 mb-2"
                    src="assets/json/animation-feature-4-dark.json"
                    background="transparent"
                    speed="1.25"
                    loop={true}
                    style={{ width: "180px" }}
                  ></lottie-player>
                  <div className="card-body fs-lg fw-semibold text-center">
                    More control of your events and experiences
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination (bullets) */}
            <div className="swiper-pagination position-relative bottom-0 mt-2"></div>
          </div>
        </section>
      </div>

      <footer className="footer pt-4 pb-4 pb-lg-5">
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
                      className="d-block text-dark dropdown-toggle d-lgclassName py-2"
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
                      className="d-block text-dark dropdown-toggle d-lgclassName py-2"
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

export default About;
