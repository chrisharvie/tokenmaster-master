import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";
import "../App.css";

//This is a function that renders a list of sold tickets based on the information passed to it.
//The tickets parameter here is meant to be the tickets mapping in the smart contract i.e the id for the ticket struct (object)
function renderSoldTickets(tickets) {
  console.log("tickets", tickets);
  return (
    <>
      <h2>Sold</h2>
      <div className="swiper-wrapper">
        <div className="swiper-slide h-auto">
          <div className="cards">
            <Row xs={1} md={2} lg={4} className="g-4 py-3">
              {/*This is a map function that tries to load the sold tickets details based on the tickets mapping i.e the id passed in */}
              {tickets.map((Ticket, idx) => {
                console.log("Ticket", Ticket);
                return (
                  <Col key={idx} className="overflow-hidden">
                    <Card className="card">
                      {/* <Card.Img variant="top" src={occasion.image} /> */}
                      {/* <h5 className="card-title mb-3">{occasion.name}</h5> */}
                      <Card.Footer>
                        For {ethers.utils.formatEther(Ticket.totalPrice)} ETH -
                        Recieved {ethers.utils.formatEther(Ticket.price)} ETH
                      </Card.Footer>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}

export default function MyListedTickets({ artick, account }) {
  const [loading, setLoading] = useState(true);
  const [listedTickets, setListedTickets] = useState([]);
  const [soldTickets, setSoldTickets] = useState([]);

  //This function is meant to retrieve information about listed and sold tickets associated with the user's account.
  const loadListedTickets = async () => {
    //creating a variable for a ticket's ID, we can use this later to fetch information
    const TicketId = await artick.TicketId();
    //Initializing two arrays, listedTickets and soldTickets, to store information about listed and sold tickets, respectively
    let listedTickets = [];
    let soldTickets = [];
    //This 'for' function pulls in listed tickets not yet sold
    for (let indx = 1; indx <= TicketId; indx++) {
      const i = await artick.tickets(indx);
      //It checks if the seller of the ticket is the same as the user's Ethereum account (account). If true, it means the user listed this ticket.
      if (i.seller.toLowerCase() === account) {
        // get uri from nft contract
        const uri = await artick.tokenURI(i.tokenId);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of ticket (ticket price + fee)
        const totalPrice = await artick.getTotalPrice(i.TicketId);
        // define listed ticket object
        let Ticket = {
          totalPrice,
          TicketId: i.TicketId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        };
        listedTickets.push(Ticket);
        // Add listed ticket to sold ticket array if sold
        if (i.sold) soldTickets.push(Ticket);
      }
    }
    setLoading(false);
    setListedTickets(listedTickets);
    setSoldTickets(soldTickets);
  };
  useEffect(() => {
    loadListedTickets();
  }, []);
  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );
  return (
    <div className="swiper-wrapper">
      <div className="swiper-slide h-auto">
        <div className="cards">
          {listedTickets.length > 0 ? (
            <div className="px-5 py-3 container">
              <h2>Listed</h2>
              <Row xs={1} md={2} lg={4} className="g-4 py-3">
                {listedTickets.map((Ticket, idx) => (
                  <Col key={idx} className="overflow-hidden">
                    <Card className="card">
                      <Card.Img variant="top" src={Ticket.image} />
                      <h5 className="card-title mb-3">{Ticket.name}</h5>
                      <Card.Footer>
                        {ethers.utils.formatEther(Ticket.totalPrice)} ETH
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
              {soldTickets.length > 0 && renderSoldTickets(soldTickets)}
            </div>
          ) : (
            <main style={{ padding: "1rem 0" }}>
              <h2>No listed tickets</h2>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}
