const Ticket = ({ i, step, seatsTaken, buyMarketItem }) => {
  return (
    <div
      onClick={() => buyMarketItem(i + step)}
      className={
        seatsTaken.find((seat) => Number(seat) == i + step)
          ? "occasion__seats--taken"
          : "occasion__seats"
      }
    >
      {i + step}
    </div>
  );
};

export default Ticket;
