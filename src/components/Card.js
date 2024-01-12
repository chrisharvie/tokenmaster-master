import { ethers } from "ethers";

const Card = ({ occasion, toggle, setToggle, setOccasion }) => {
  const togglePop = () => {
    setOccasion(occasion);
    toggle ? setToggle(false) : setToggle(true);
  };

  return (
    <div className="card h-100" style={{ height: "150px", width: "300px" }}>
      <img
        src="https://indigo-tropical-bird-111.mypinata.cloud/ipfs/QmV6N4PciVanp7Jj4VcdWWiChS9AXRafwTxYwr6waNRZwi?_gl=1*1bondwj*_ga*MTQ2MDIyNjY5NS4xNzAyODUwNDA4*_ga_5RMPXG14TE*MTcwMjkxNDM4MC4yLjAuMTcwMjkxNDM4NS41NS4wLjA."
        className="card-img-top"
        alt="Card image"
        style={{ height: "130px", width: "auto" }}
      ></img>
      <div className="card-body">
        <p className="card__date">
          <strong>{occasion.date}</strong>
          {occasion.time}
        </p>

        <h5 className="card-title mb-3">{occasion.name}</h5>
        <h3 className="card-text mb-4">{occasion.description}</h3>
        <p className="card__location" style={{ textAlign: "left" }}>
          <small>{occasion.location}</small>
        </p>

        <p className="card__cost">
          <strong>
            {ethers.utils.formatUnits(occasion.cost.toString(), "ether")}
          </strong>
          ETH
        </p>

        {occasion.tickets.toString() === "0" ? (
          <button type="button" className="card__button--out" disabled>
            Sold Out
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={() => togglePop()}
          >
            {" "}
            View Tickets
          </button>
        )}
      </div>

      <hr />
    </div>
  );
};

export default Card;
