// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Artick is ERC721 {
    //---state variables ---//
    //These are the like variables in other coding languages, updating these costs gas, some of them will be updated using fucntions below or on deployment of the contract, some are immutable and won't change
    address public owner; //Person/wallet who deploys the contract, set when deploying the contract
    uint TicketId; //Id for the ticket, used in the ticket struct, see below.
    uint public totalOccasions; //Total number of occasions, we can keep track of this for referencing purposes.
    uint public totalSupply; //Total supply of nft's/tickets that exist.  It's a cumulative count of all the tickets created across all occasions
    address payable public immutable feeAccount; //The account that receives fees
    uint public immutable feePercent; //Platform fee charged with every sale of a ticket

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
        string image; //Image for the ticket
    }

    //---Ticket mapping---//
    //this mapping essentialy gives the Ticket struct an ID and an easy way to look-up/ find information regarding the ticket object.
    mapping(uint => Ticket) public tickets;

    //--Ticket events---//
    //Events allow us to cheaply store data on the bloackchain, the fact the nft's and sellers are indexed allows us to search for them as filters.
    //They also provide a public record of the ticket being offered for sale, making it possible for external parties to track and respond to changes in the state of the smart contract
    event OfferedTicket(
        uint TicketId, //the same ID as in the Ticket struct. Should have the same value
        address indexed nft, //represents the address of the NFT contract that the ticket was deployed with
        uint tokenId, //the same ID as in the Ticket struct. Should have the same value
        uint price, //represents the price at which the ticket is listed for sale
        address indexed seller //represents the address of the seller who listed the ticket for sale
    );

    //This event signifies that a purchase has occurred. It is emitted when a buyer successfully purchases an ticket (NFT or ticket) from the marketplace. It should have the same paramters as the offer event with the additional buyer address
    event Bought(
        uint TicketId, // the same ID as in the Ticket struct. Should have the same value
        address indexed nft,
        uint tokenId, //the same ID as in the Ticket struct. Should have the same value
        uint price, //represents the price at which the ticket is listed for sale
        address indexed seller, //represents the address of the seller who listed the ticket for sale
        address indexed buyer //represents the address of the buyer who bought the ticket for sale
    );

    //<-!!!! ---Occasions--- !!! ->

    //This is an event but we can't use the event word as it is a keyword so we'll use occasion. This is an object for an occasion e.g a concert/ match
    struct Occasion {
        uint id; //a unique identifier assigned to each occasion. It allows for the differentiation between different occasions
        string name; //the name of the occasion e.g Artick's first event
        uint cost; //cost to go to the event. This is the same as price but we use cost for display reasons
        uint tickets; // keeps track of the number of tickets available for the occasion. It should decrease as tickets are sold or reserved.
        uint maxTickets; //specifies the maximum number of tickets that can be sold or issued for the occasion. It sets an upper limit on the number of participants.
        string date; //stores the date of the occasion, providing information about when the occasion is scheduled to take place.
        string time; //stores the time of the occasion, providing information about when the occasion is scheduled to take place
        string location; //stores the location of the occasion, providing information about where the occasion is scheduled to take place
        string description; //provides more context about the event, the performer, and key information
        string image; //the nft image (This can be a poster type image that is generic)
    }

    //---Occasion mapping---//
    //this mapping gives us an easily identifiable id for the occasion which we can then use to get information about the occasion object
    mapping(uint => Occasion) occasions;

    //---General mappings---//
    //this mapping tells you the individual ticket and who owns it for a given occasion
    mapping(uint => mapping(uint => address)) public TicketTaken;
    //in this mapping the array stores ticket numbers that have been taken for the corresponding occasion. A plural for all tickets for the occasion
    mapping(uint => uint[]) TicketsTaken;
    //this is used to track whether a specific address has bought a ticket for a particular occasion. We can use this for verification and troubleshooting reasons. Can also potentially stop ticketing bots from using the same address buying multiple tickets
    mapping(uint => mapping(address => bool)) public hasBought;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    //every nft has a name and symbol, this sets it for the nft tickets. Feepercent is set in the deploy script
    constructor(uint _feePercent) ERC721("Artick", "ATK") {
        owner = msg.sender;
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // -------  Creating occasions ---- //
    //This is a function for creating occasions. The arguments/values passed into the parameters should follow that set out in the occasion struct above and come from the deploy script where this function is called.
    function listOccasion(
        uint _id,
        string memory _name,
        uint _cost,
        uint _tickets,
        uint _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location,
        string memory _description,
        string memory _image
    ) public onlyOwner {
        //the totalOccasion identifier is incremented to esnure each occasion created has a unique identifier
        totalOccasions++;

        //This creates a new occasion struct and stores it in the occasions mapping. The key used for the mapping is the totalOccasions identifier.
        occasions[totalOccasions] = Occasion(
            _id,
            _name,
            _cost,
            _tickets,
            _maxTickets,
            _date,
            _time,
            _location,
            _description,
            _image
        );
    }

    // ----- Create tickets ----//
    //This function will create a ticket for the ticket struct. We need a mint function for the creation of the nft's on the blockchain and a 'make ticket' for our own app/ecosystem.
    //All the parameters relate to the Ticket struct above. The values for this should be passed in via the create component and the mintthenlist function
    function makeTicket(
        uint _TicketId,
        IERC721 _artick,
        uint _tokenId,
        uint _price,
        uint _occasionId,
        address _seller,
        bool _sold,
        string memory _image
    ) external onlyOwner {
        //require price to be higher than 0, if true it runs the code, if not it emits this message
        require(_price > 0, "Price must be greater than zero");

        //This part of the code is responsible for creating and listing a new ticket associated with the occasion
        //The TicketId is incremented to ensure that each ticket gets a unique identifier.
        TicketId++;
        //This line creates a new instance of the Ticket struct and stores it in the tickets mapping,
        tickets[TicketId] = Ticket(
            _TicketId,
            IERC721(address(this)),
            _tokenId,
            _price,
            _occasionId,
            payable(owner),
            false,
            _image
        );
        emit OfferedTicket(
            _TicketId,
            address(this),
            tickets[TicketId].tokenId,
            _price,
            payable(owner)
        );
    }

    //Mintin g NFT's---//
    //This is a mint function to try and create tickets (nft's) for an occasion
    function mint(uint _TicketId, uint _ticket, uint _tokenId) public payable {
        //Require the id is not 0 or less than the total occassions. so event can't be 0 or less than what is epxected
        require(_TicketId != 0);
        require(_TicketId <= totalOccasions);

        //Ensure amount of crypto sent is correct '.cost' is the amount of crypto sent in and should be the cost of the occasion as set in the struct when deployed
        require(msg.value >= occasions[_TicketId].cost);
        //Require that the ticket is not taken, and the ticket exists
        require(TicketTaken[_TicketId][_ticket] == address(0));

        //Decrease the supply of tickets. This means when a ticket is bought the supply oif tickets goes down for an occasion. It's a crucial step because, with each minted ticket, the number of available tickets for that occasion should decrease. This prevents overselling and ensures that the total number of tickets doesn't exceed the maximum limit set for the occasion.
        occasions[_TicketId].tickets -= 1;
        //This information can be useful for verification purposes, preventing a single address from buying multiple tickets for the same occasion. (we can probaky create a sperate value to check if someone hasn't bought more than a certain number e.g 4)
        hasBought[_TicketId][msg.sender] = true;
        //asigns tickets to persons address calling the function (i will need this to be on the purchase ticket function, probably not on the mint function)
        TicketTaken[_TicketId][_ticket] = msg.sender;
        //This line appends the newly assigned seat to the list of seats taken for the specified occasion. It provides an easy way to retrieve information about the occupied seats for a particular occasion.
        TicketsTaken[_TicketId].push(_ticket);
        //This line updates the occasionid for the newly minted ticket. It associates the minted ERC721 token with a specific occasion. This association is crucial for tracking which occasion a ticket belongs to.
        tickets[totalSupply].TicketId = _TicketId;

        //This line increments the totalSupply variable by 1. The totalSupply represents the total number of NFTs (non-fungible tokens) minted in the contract
        totalSupply++;
        //This line calls the _safeMint function, which is part of the ERC721 standard. It mints a new NFT and assigns ownership to the address specified as the first argument. The second argument is typically used as the unique identifier or token ID for the newly minted NFT.
        _safeMint(msg.sender, totalSupply);
    }

    //---General functions to help retrieve data---//

    //---Get Occasion---//
    //This is a function for retrieving details about an occasion. The _id parameter represents the unique identifier of the occasion and the occasion.id in the occasion struct
    function getOccasion(uint _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    //---Getting tickets for occasions---//
    //This function retrives an array of tickets associated with a specific occasion. The maximum number of tickets (maxTickets) is not directly used in this function because the function is focused on fetching tickets for a given occasion, not enforcing or checking the maximum limit. That is done in the list function
    function getTicketsForOccasion(
        uint _occasionId
    ) public view returns (Ticket[] memory) {
        //Checking whether the provided _occasionId is valid
        require(
            _occasionId > 0 && _occasionId <= totalOccasions,
            "Invalid occasionId"
        );
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

    //---Get tickets taken---//
    //This function has been created to retrieve an array of tickets that have been bought for a specific occasion. We can use this to stop people buying tickets already sold
    function getTicketsTaken(
        uint256 _id
    ) public view returns (uint256[] memory) {
        return TicketsTaken[_id];
    }

    //---Withdraw crypto/revenue---//
    //We can use this function to withdraw the funds (where/when shall we use/call this function??)
    function withdraw() public onlyOwner {
        //the call function sends a request to the owner address, in this case the minter. the call needs to either be successful or not
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }

    //---Buying NFT'S/Tickets---//
    //This function allows for the purchasing of an nft. The TicketId parameter should be the value for the TicketId in the Ticket struct
    function purchaseTicket(uint _TicketId) external payable {
        //Assigning the total price to a local state variable. 'gettotalprice' is calculated below
        uint _totalPrice = getTotalPrice(_TicketId);
        //This line is establishing a reference to the ticket identified by the _TicketId within the tickets mapping. It's essentially creating an alias or reference to the specific ticket to work with in the rest of the function
        Ticket storage ticket = tickets[_TicketId];
        //Some validation checks on the existence of the ticket and if it's sold
        require(_TicketId > 0 && _TicketId <= TicketId, "Ticket doesn't exist");
        require(
            msg.value >= _totalPrice,
            "not enough ether to cover ticket price and market fee"
        );
        require(!ticket.sold, "ticket already sold");
        //This line is to pay the seller the fee amount. the address of the seller parameter in the ticket struct has the trasnfer function called on it to transfer the price to it and it transfers the ticket's price
        ticket.seller.transfer(ticket.price);
        //This tansfer's the fee's to the fee account address. total price comes from the variable above
        feeAccount.transfer(_totalPrice - ticket.price);
        //Update ticket to sold so we know the ticket is sold
        ticket.sold = true;
        //Transfer nft from the smart contract of this app to the buyer, the parameters come from the ERC contract imported, then the id of the token
        ticket.nft.transferFrom(address(this), msg.sender, ticket.tokenId);
        //Emit a 'Bought' event. The parameters should be the same as outlined above
        emit Bought(
            TicketId,
            address(ticket.nft),
            ticket.tokenId,
            ticket.price,
            ticket.seller,
            msg.sender
        );
    }

    //---Get the total price including fee's---//
    //Reads/fethces the toal price of the nft/ticket
    function getTotalPrice(uint _TicketId) public view returns (uint) {
        return ((tickets[_TicketId].price * (100 + feePercent)) / 100);
    }

    //---Selling tickets---//
    //(How can we set a maximum price...)
    function sellTicket(
        uint256 _tokenId,
        uint256 _newPrice,
        Ticket memory ticket
    ) public {
        // Check if the sender owns the ticket
        require(msg.sender == ticket.seller, "You do not own this ticket");
        // Check if the ticket is not already sold
        require(!ticket.sold, "Ticket has already been sold");

        // Update the ticket's price
        tickets[_tokenId].price = _newPrice;

        //Transfer the nft to a new account wallet. calling the transferfrom function inherrited from the ozep contract
        //The arguments in the transferfrom function are required, address from, address to (recieves the nft), tokenid which is passed in ass an argument above
        transferFrom(msg.sender, address(this), _tokenId);

        // Emit the Bought event
        emit Bought(
            TicketId,
            address(ticket.nft),
            ticket.tokenId,
            ticket.price,
            ticket.seller,
            msg.sender
        );
    }
}
