import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";
import SaleConfirmation from "./SaleConfirmation";
import "../App.css";

export default function MyPurchases({ artick, account }) {
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const loadPurchasedTickets = async () => {
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter = artick.filters.Bought(null, null, null, null, null, account);
    const results = await artick.queryFilter(filter);
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(
      results.map(async (i) => {
        // fetch arguments from each result
        i = i.args;
        // get uri url from nft contract
        const uri = await artick.tokenURI(i.tokenId);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item (item price + fee)
        const totalPrice = await artick.getTotalPrice(i.TicketId);
        // define listed item object
        let purchasedTicket = {
          totalPrice,
          price: i.price,
          TicketId: i.TicketId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        };
        return purchasedTicket;
      })
    );
    setLoading(false);
    setPurchases(purchases);
  };
  useEffect(() => {
    loadPurchasedTickets();
  }, []);

  const toggleConfirmationModal = () => {
    setConfirmationModal(!confirmationModal);
  };

  const sellTicketHandler = (ticket) => {
    // Set the selected ticket and show the confirmation modal
    setSelectedTicket(ticket);
    toggleConfirmationModal();
  };

  const togglePop = () => {
    console.log("Toggle");
  }

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
          {purchases.length > 0 ? (
            <div className="px-5 container">
              <Row xs={1} md={2} lg={4} className="g-4 py-5">
                {purchases.map((Ticket, idx) => (
                  <Col key={idx} className="overflow-hidden">
                    <Card className="card">
                      <Card.Img variant="top" src={Ticket.image} />
                      {/* <h5 className="card-title mb-3">{occasion.name}</h5> */}
                      <Card.Footer>
                        {ethers.utils.formatEther(Ticket.totalPrice)} ETH
                        <button
                          type="button"
                          class="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => togglePop()}
                        >
                          {" "}
                          Sell ticket
                        </button>
                        {/* Sales Confirmation Modal */}
                        {confirmationModal && (
                          <SaleConfirmation
                            selectedTicket={selectedTicket}
                            onClose={toggleConfirmationModal}
                            onSellTicket={(Ticket) => {
                              // onSellTicket(Ticket);
                              toggleConfirmationModal();
                            }}
                          />
                        )}
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <main style={{ padding: "1rem 0" }}>
              <h2>No purchases</h2>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}
