import "../App.css/";

function SaleConfirmation() {
  return (
    <div>
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
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
        <h3 className="card-text  fs-lg">
          Please confirm you wish to sell your ticket
        </h3>

        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={sellHandler}
        >
          Sell Ticket
        </button>
      </div>
    </div>
  );
}

export default SaleConfirmation;
