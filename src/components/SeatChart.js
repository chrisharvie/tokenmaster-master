import { useEffect, useState } from "react";

// Import Components
import EventTicket from "./EventTicket";

const SeatChart = ({ occasion, artick, setToggle }) => {
  const [TicketsTaken, setTicketsTaken] = useState(false);
  const [hasSold, setHasSold] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [occasionItems, setOccasionItems] = useState([]);

  const getTicketsTaken = async () => {
    const TicketsTaken = await artick.getTicketsTaken(occasion.id);
    setTicketsTaken(TicketsTaken);
  };

  const buyTicket = async (Ticket) => {
    //it calls the purchase item function on the marketplace, passing in the arguments as needed
    await (
      await artick.purchaseTicket(Ticket.TicketId, { value: Ticket.totalPrice })
    ).wait();
  };

  useEffect(() => {
    getTicketsTaken();
  }, [hasSold]);

  const incrementTicketCounter = () => {
    setTicketQuantity(ticketQuantity + 1);
  };

  const getTicketsForOccasion = async (occasionId) => {
    try {
      // Call the smart contract function to get items for a specific occasion
      const items = await artick.getTicketsForOccasion(occasionId);

      // Assuming the smart contract returns an array of items
      return EventTicket;
    } catch (error) {
      console.error("Error fetching items for occasion:", error);
      return [];
    }
  };

  const getOccasionItems = async (occasionId) => {
    try {
      // Call getItemsForOccasion to fetch items
      const occasionItems = await getTicketsForOccasion(occasionId);

      // Update the state variable
      setOccasionItems(occasionItems);
    } catch (error) {
      console.error("Error fetching occasion items:", error);
    }
  };

  useEffect(() => {
    getOccasionItems(occasion.id);
  }, [occasion.id]);
  return (
    <div>
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {occasion.name}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setToggle(false)}
              ></button>
            </div>
            <div className="modal-body">
              {occasion.description}
              {occasionItems.map((Ticket) => (
                <div key={Ticket.TicketId}></div>
              ))}
            </div>

            <h3 className="card-text  fs-lg">Quantity Counter</h3>

            <p>
              Items in Cart:{ticketQuantity}
              <span className="badge badge-primary" id="itemCount">
                0
              </span>
            </p>
            <button
              className="btn btn-lg btn-outline-secondary mb-3"
              onClick={incrementTicketCounter}
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="btn btn-primary mb-3"
              onClick={buyTicket}
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatChart;
