//Import React imports
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//Importing css
import "./App.css";

// Components
import Card from "./components/Card.js";
import SeatChart from "./components/SeatChart.js";
import About from "./components/About.js";
import MyPurchases from "./components/MyPurchases.js";
import Create from "./components/Create.js";
import MyListedTickets from "./components/MyListedTickets.js";
import Home from "./components/Home.js";
import Navigation from "./components/Navigation.js";
// ABIs
import Artick from "./abis/Artick.json";

// Config
import config from "./config.json";

//Importing ethers library
const ethers = require("ethers");

function App() {
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
    <BrowserRouter>
      <div className="App">
        <Navigation web3Handler={web3Handler} account={account} />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />}></Route>
          <Route path="/create" element={<Create />}></Route>
          <Route path="/my-purchases" element={<MyPurchases />}></Route>
          <Route
            path="/my-listed-tickets"
            element={<MyListedTickets />}
          ></Route>
          <Route path="/about" element={<About />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
