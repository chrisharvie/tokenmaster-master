// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Artick is ERC721 {
address public owner; //person who deploys the contract
uint TicketId;//Id for the ticket
uint public totalOccasions; // total number of occasions
uint public totalSupply; //total supply of nft's/tickets that exist.  It's a cumulative count of all the tickets created across all occasions
address payable public immutable feeAccount; // the account that receives fees
uint public immutable feePercent; //platform fee charged with every sale

//<-!!!! ---Tickets--- !!! ->


//A struct (solidity object) for an nft/ticket thay has specific data points. 
struct Ticket {
        uint TicketId; // an identifier within the app e.g ticket 1,2,3. set when listing a new ticket, and it is incremented to provide a unique identifier for each ticket. This is internal marketplace logic.
        IERC721 nft; //an instannce of the nft contract associate with the nft/ticket
        uint tokenId; //Unique identifier for the ERC721 token associated with the ticket. This is set when minting a new ERC721 token, and it is incremented to provide a unique identifier for each token
        uint price; // Price of the ticket
        uint occasionId; // Identifier of the occasion associated with the ticket
        address payable seller; // Address of the seller
        bool sold; // Flag indicating whether the ticket has been sold
    }
//this mapping essentialy gives the Ticket struct an ID and an easy way to look-up/ find information regarding the ticket object.
    mapping(uint => Ticket) public tickets;


//events allow us to cheaply store data on the bloackchain, the fact the nft's and sellers are indexed allows us to search for them as filters. 
//They also provide a public record of the ticket being offered for sale, making it possible for external parties to track and respond to changes in the state of the smart contract
    event OfferedTicket(
        uint TicketId, //the same ID as in the Ticket struct. Should have the same value
        address indexed nft, //represents the address of the NFT contract that the ticket was deployed with
        uint tokenId, //the same ID as in the Ticket struct. Should have the same value
        uint price, //represents the price at which the ticket is listed for sale
        address indexed seller //represents the address of the seller who listed the ticket for sale
    );

//This event signifies that a purchase has occurred. It is emitted when a buyer successfully purchases an ticket (NFT or ticket) from the marketplace
     event Bought(
        uint TicketId,// the same ID as in the Ticket struct. Should have the same value
        address indexed nft,
        uint tokenId, //the same ID as in the Ticket struct. Should have the same value
        uint price, //represents the price at which the ticket is listed for sale
        address indexed seller, //represents the address of the seller who listed the ticket for sale
        address indexed buyer //represents the address of the buyer who bought the ticket for sale
    );


//<-!!!! ---Occasions--- !!! ->    

//This is an event but we can't use the event word as it is a keyword. This is an object for an event e.g a concert/ match
struct Occasion {
uint id; //a unique identifier assigned to each occasion. It allows for the differentiation between different occasions 
string name; //the name of the occasion e.g Artick's first event
string cost; //cost to go to the event.
uint tickets; // keeps track of the number of tickets available for the occasion. It should decrease as tickets are sold or reserved.
uint maxTickets; //specifies the maximum number of tickets that can be sold or issued for the occasion. It sets an upper limit on the number of participants.
string date; //stores the date of the occasion, providing information about when the occasion is scheduled to take place.
string time; //stores the time of the occasion, providing information about when the occasion is scheduled to take place
string location; //stores the location of the occasion, providing information about where the occasion is scheduled to take place
string description; //provides more context about the event, the performer, and key information
string image; //the nft image
}

//this mapping gives us an easily identifiable id for the occasion which we can then use to get information about the occasion object
mapping (uint => Occasion) occasions;
//this mapping tells you the individual ticket and who owns it for a given occasion
mapping (uint => mapping(uint => address)) public TicketTaken;
//in this mapping the array stores ticket numbers that have been taken for the corresponding occasion. A plural for all tickets for the occasion
mapping(uint => uint []) TicketsTaken;
//this is used to track whether a specific address has bought a ticket for a particular occasion. We cna use this for verification and troubleshooting reasons. Can also potentially stop ticketing bots from using the same address buying multiple tickets
mapping(uint => mapping(address => bool)) public hasBought;



modifier onlyOwner (){
   require(msg.sender == owner);
   _;
}

//every nft has a name and symbol, this sets it for the nft tickets
   constructor (string memory _name, string memory _symbol, uint _feePercent) ERC721 (_name, _symbol) {
owner=msg.sender;
 feeAccount = payable(msg.sender);
 feePercent = _feePercent;
   }

function list (uint _occasionId, string memory _name, uint _cost, uint _tickets, uint _maxTickets, string memory _date, string memory _time, string memory _location, string memory _description, string memory _image) public onlyOwner {
   //the totalOccasion identifier is incremented to esnure each occasion created has a unique identifier
   totalOccasions++;

//This creates a new occasion struct and stores it in the occasions mapping. The key used for the mapping is the totalOccasions identifier
//The values to be assigned to the new occasion struct/object are provided as arguments above in this function
   occasions[totalOccasions] = Occasion(totalOccasions, _name, _cost, _tickets, _maxTickets, _date,_time, _location, _description, _image);

//This part of the code is responsible for creating and listing a new ticket associated with the occasion
//The TicketId is incremented to ensure that each ticket gets a unique identifier.
    TicketId++;
//This line creates a new instance of the Ticket struct and stores it in the tickets mapping, totaloccasiosn is used as the occasionID
    tickets[TicketId] = Ticket(TicketId, IERC721(address(this)), tokenId, false);
    emit OfferedTicket(TicketId, address(this), tickets[TicketId].tokenId, totalOccasions, _cost, payable(owner));
}

//This is a function for retrieving details about an occasion. The _id parameter represents the unique identifier of the occasion 
function getOccasion (uint _id) public view returns (Occasion memory){
   return occasions[_id];
}

//This is a mint function to try and create tickets (nft's) for an occasion
function mint (uint _occasionId, uint _id, uint _ticket) public payable{
   //require the id is not 0 or less than the total occassions. so even can't be 0 or less than what is epxected
require(_id!=0);
require(_id <= totalOccasions);
require(_occasionId != 0 && _occasionId <= totalOccasions, "Invalid occasionId");

//ensure amount of crypto sent is correct .cost is the amount of crypto sent in and should be the cost of the occasion as set in the struct
require(msg.value >= occasions[_id].cost);
// Require that the ticket is not taken, and the ticket exists
require(TicketTaken[_id][_ticket] == address(0));
require(_ticket <= occasions[_id].maxTickets);
//Decrease the supply of tickets. This means when a ticket is bought the supply oif tickets goes down for an occasion. It's a crucial step because, with each minted ticket, the number of available tickets for that occasion should decrease. This prevents overselling and ensures that the total number of tickets doesn't exceed the maximum limit set for the occasion.
occasions[_id].tickets-= 1;
//This information can be useful for verification purposes, preventing a single address from buying multiple tickets for the same occasion. (we can probaky create a sperate value to check if someone hasn't bought more than a certain number e.g 4)
hasBought[_id][msg.sender] = true;
//asigns tickets to persons address calling the function (i will need this to be on the purchase ticket function, probably not on the mint function)
TicketTaken[_id][_ticket] = msg.sender;
//This line appends the newly assigned seat to the list of seats taken for the specified occasion. It provides an easy way to retrieve information about the occupied seats for a particular occasion.
TicketsTaken[_id].push(_ticket);
//This line updates the occasionId for the newly minted ticket. It associates the minted ERC721 token with a specific occasion. This association is crucial for tracking which occasion a ticket belongs to.
tickets[totalSupply].occasionId = _occasionId; // Update occasionId for the minted ticket


//This line increments the totalSupply variable by 1. The totalSupply represents the total number of NFTs (non-fungible tokens) minted in the contract
   totalSupply++;
//This line calls the _safeMint function, which is part of the ERC721 standard. It mints a new NFT and assigns ownership to the address specified as the first argument. The second argument is typically used as the unique identifier or token ID for the newly minted NFT.   
   _safeMint(msg.sender, totalSupply);
}
//This function has been created to retrieve an array of tickets that have been taken for a specific occasion. We cna use this to stop people buying tickets already sold
  function getTicketsTaken(uint256 _id) public view returns (uint256[] memory) {
        return TicketsTaken[_id];
    }
    function withdraw () public onlyOwner {
      //the call function sends a request to the owner address, in this case the minter. the call needs to either be successful or not
      (bool success, ) = owner.call{value: address (this).balance}("");
      require(success);
      }


    //function for purchasing an nft
    function purchaseTicket(uint _TicketId) external payable  {
        //assigning the total price to a local state variable. 'gettotalprice' is calculated below
        uint _totalPrice = getTotalPrice(_TicketId);
        //This line is establishing a reference to the ticket identified by the _TicketId within the tickets mapping. It's essentially creating an alias or reference to the specific ticket to work with in the rest of the function
        Ticket storage Ticket = tickets[_TicketId];
        //some validation checks on the existence of the ticket and if it's sold
        require(_TicketId > 0 && _TicketId <= TicketId, "Ticket doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover ticket price and market fee");
        require(!Ticket.sold, "ticket already sold");
        //This line is to pay the seller the fee amount. the address of the seller parameter in the ticket struct has the trasnfer function called on it to transfer the price to it and it transfers the ticket's price       
        Ticket.seller.transfer(Ticket.price);
        //This tansfer's the fee's to the fee account address. total price comes from the variable above
        feeAccount.transfer(_totalPrice - Ticket.price);
        //update ticket to sold so we know the ticket is sold
        Ticket.sold = true;
        //transfer nft from the smart contract of this app to the buyer, the parameters come from the ERC contract imported, then the id of the token
        Ticket.nft.transferFrom(address(this), msg.sender, Ticket.tokenId);
        // emit Bought event
        emit Bought(
            TicketId,
            address(Ticket.nft),
            Ticket.tokenId,
            Ticket.price,
            Ticket.seller,
            msg.sender
        );
    }
    //reads/fethces the toal price of the nft/ticket
    function getTotalPrice(uint _TicketId) view public returns(uint){
        return((tickets[_TicketId].price*(100 + feePercent))/100);
    }

//This function retrives an array of tickets associated with a specific occasion. The maximum number of tickets (maxTickets) is not directly used in this function because the function is focused on fetching tickets for a given occasion, not enforcing or checking the maximum limit. That is done in the list function
     function getTicketsForOccasion(uint _occasionId) public view returns (Ticket[] memory) {
        // Checking whether the provided _occasionId is valid
        require(_occasionId > 0 && _occasionId <= totalOccasions, "Invalid occasionId");
        //A variable that is a counter for the toal number of tickets associated with an event/occasion. TicketId represents the total number of tickets. I.e if the last ticket created is 129, then you will 129 tickets associated with an occasion
        uint occasionTicketCount = 0;
        //a loop that iterates from 1 to TicketId, which represents the total number of tickets in the contract.
        for (uint i = 1; i <= TicketId; i++) {
            if (tickets[i].occasionId == _occasionId) {
                occasionTicketCount++;
            }
        }
        // Create a dynamic array to store the tickets for the occasion
        Ticket[] memory occasionTickets = new Ticket[](occasionTicketCount);
        uint index = 0;
        // Populate the array with tickets associated with the specified occasion
        for (uint i = 1; i <= TicketId; i++) {
            if (tickets[i].occasionId == _occasionId) {
                occasionTickets[index] = tickets[i];
                index++;
            }
        }
        // Return the array of tickets for the specified occasion
        return occasionTickets;
    }
}
