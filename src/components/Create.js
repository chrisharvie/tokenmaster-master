//"Create" component interacts with the NFT contract to mint a new NFT and the Marketplace contract to list the newly created NFT for sale.
//The mintThenList function mints a new NFT and lists it on the marketplace. This function interacts with both the NFT and Marketplace contracts.
import axios from "axios";
import { useState } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";

const Create = (artick) => {
  console.log("artick", artick);

  //keeps track of the state of the image, price, name and description
  const [fileImg, setFile] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDescription] = useState("");
  const [price, setPrice] = useState("");

  console.log("API Key:", process.env.REACT_APP_PINATA_API_KEY);
  console.log("API Secret Key:", process.env.REACT_APP_PINATA_SECRET_API_KEY);

  //creates the json file that is uploaded to IPFS when the sendfiletoIPFS function is called
  const sendJSONtoIPFS = async (ImgHash) => {
    try {
      //makes an API post call to send json to IPFS
      const resJSON = await axios({
        method: "post",
        url: "./https://api.pinata.cloud/pinning/pinJsonToIPFS",
        data: {
          name: name,
          description: desc,
          image: ImgHash,
        },
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
        },
      });

      // https://gateway.pinata.cloud/ipfs/QmZ6iZAhazHyakzynC4sxZ6r6cikJmS69mZaCoyburKuq
      //this creates the token URI variable which is passed into the mint fuinction
      //points to the URI for where the metadata lives on IPFS
      const tokenURI = `./https://gateway.pinata.cloud/ipfs/${resJSON.data.IpfsHash}`;
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

    if (fileImg) {
      //all of this try code is uploading the image file to IPFS
      try {
        console.log("1234");
        const formData = new FormData();
        formData.append("file", fileImg);
        console.log(formData);
        const resFile = await axios({
          method: "post",
          url: "./https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
            pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `./https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
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
    await (
      await artick.makeTicket(
        TicketId,
        artick.address,
        uri,
        price,
        occasionId,
        payable(owner),
        false
      )
    ).wait();

    //mint nft. mint function from nft contract
    await (await artick.mint(uri)).wait();
    // approve marketplace to spend nft
    await (await artick.setApprovalForAll(artick.address, true)).wait();
    // add nft/ticket to website, this converts the wei into a string
    const price = ethers.utils.parseEther(price.toString());
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
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 mx-auto"
          style={{ maxWidth: "1000px" }}
        >
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                onChange={(e) => setFile(e.target.files[0])}
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
              <div className="d-grid px-0">
                <Button onClick={sendFileToIPFS} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Create;
