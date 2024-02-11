import axios from "axios";
import { useState } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";

import Navigation from "./Navigation";

//"Create" component interacts with the NFT contract to mint a new NFT and the Marketplace contract to list the newly created NFT for sale.
const Create = (artick) => {
  //keeps track of the state of all the tickets arguments
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [TicketId, setTicketId] = useState("");
  const [OccasionId, setOccasionId] = useState("");
  const [owner, setOwner] = useState("");
  const [payable, setPayable] = useState("");
  const [provider, setProvider] = useState(null);
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

  //creates the json file that is uploaded to IPFS when the sendfiletoIPFS function is called
  const sendJSONtoIPFS = async (ImgHash) => {
    try {
      //makes an API post call to send json to IPFS
      const resJSON = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
        //All these fields correspond to fields in the ticket struct and are passed in below in the mint then list function
        data: {
          name: name,
          description: desc,
          price: price,
          image: ImgHash,
          TicketId: TicketId,
          OccasionId: OccasionId,
          owner: payable,
        },
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
        },
      });

      //this creates the token URI variable which is passed into the mint fuinction
      //points to the URI for where the metadata lives on IPFS
      const tokenURI = `https://gateway.pinata.cloud/ipfs/${resJSON.data.IpfsHash}`;
      console.log("Token URI", tokenURI);
      //mintNFT(tokenURI, currentAccount)
      //calls the function to mint an NFT and list it on the marketplace
      mintThenList(tokenURI);
    } catch (error) {
      console.log("JSON to IPFS: ");
      console.log(error);
    }
  };

  //called when a user clicks a button to create and list an NFT.
  const sendFileToIPFS = async (e) => {
    e.preventDefault();
    console.log("123");
    console.log(e);

    if (image) {
      //all of this try code is uploading the image file to IPFS
      try {
        console.log("1234");
        const formData = new FormData();
        formData.append("file", image);
        console.log(formData);
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
            pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        console.log(ImgHash);
        //calling this function then sends the resulting JSON data to IPFS
        sendJSONtoIPFS(ImgHash);
      } catch (error) {
        console.log("File to IPFS: ");
        console.log(error);
      }
    }
  };

  //This is a function that creates a ticket struct and mints a new ticket. The URI parameter takes the value of that set in the 'sendtojson' function above
  const mintThenList = async (uri) => {
    // e.g.const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    //calling the makeItem function from the marketplace contract. This should create a ticket struct with a TicketId as the variable is increased and that can be used in the mint function in the contract in the require statements
    //We can use the URI for the function as the tokenID when the nft is minted.

    // this converts the wei into a string
    const price = ethers.utils.parseEther(price.toString());

    await (
      await artick.makeTicket(
        TicketId,
        artick.address,
        uri,
        price,
        OccasionId,
        payable(owner),
        false,
        image
      )
    ).wait();

    //mint nft. mint function from nft contract
    await (await artick.mint(uri)).wait();
    // approve marketplace to spend nft
    await (await artick.setApprovalForAll(artick.address, true)).wait();
  };

  const revealNFTs = async () => {
    try {
      await artick.revealCollection();
      alert("NFT collection revealed!");
    } catch (error) {
      console.error("Error revealing NFT collection:", error);
      alert("An error occurred while revealing the NFT collection.");
    }
  };

  return (
    <div>
      <Navigation web3Handler={web3Handler} account={account} />
      <main
        role="main"
        className="col-lg-12 mx-auto bg-dark bg-size-cover bg-repeat-0 bg-position-center position-relative overflow-hidden py-5 mb-4"
        style={{ maxWidth: "2000px" }}
      >
        <div className="row">
          <div className="content mx-auto" style={{ marginTop: "250px" }}>
            <Row className="g-4">
              <Form.Control
                onChange={(e) => setImage(e.target.files[0])}
                size="lg"
                required
                type="file"
                name="file"
              />
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Name"
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                required
                as="textarea"
                placeholder="Description"
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size="lg"
                required
                type="number"
                placeholder="Price in ETH"
              />
              <Form.Control
                onChange={(e) => setTicketId(e.target.value)}
                size="lg"
                required
                type="number"
                placeholder="TicketId"
              />
              <Form.Control
                onChange={(e) => setOccasionId(e.target.value)}
                size="lg"
                required
                type="number"
                placeholder="OccasionId"
              />

              <Form.Control
                onChange={(e) => setPayable(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Owner's address"
              />
              <div className="d-grid px-0">
                <Button onClick={sendFileToIPFS} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Create;
