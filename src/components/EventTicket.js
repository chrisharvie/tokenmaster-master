//This is a ticket component. It's meant to be used for each ticket for each occasion. We can tell if it's bought or not.
// i = an index or some identifier for the specific ticket
//TicketsTaken = array containing information about seats that have already been taken or reserved
// buyTicket = A function that seems to be responsible for handling the action of buying a market item

const EventTicket = ({ i, step, TicketsTaken, buyTicket }) => {
  return (
    <div
      onClick={() => buyTicket(i + step)}
      className={
        TicketsTaken.find((Ticket) => Number(Ticket) == i + step)
          ? "occasion__seats--taken"
          : "occasion__seats"
      }
    >
      {i + step}
    </div>
  );
};

export default EventTicket;
