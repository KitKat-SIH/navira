id_inactive.js
// install ethers first: npm install ethers dotenv
import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

// ==== CONFIG ====
const RPC_URL = process.env.RPC_URL; // Infura/Alchemy Sepolia URL
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Wallet private key
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const ABI = [
  // Event for registering tourist
  {
    "anonymous": false,
    "inputs":[
      {"indexed": false,"internalType":"string","name":"_touristID","type":"string"}
    ],
    "name":"TouristRegistered",
    "type":"event"
  },
  // getTouristbyID
  {
    "inputs":[{"internalType":"string","name":"_touristID","type":"string"}],
    "name":"getTouristbyID",
    "outputs":[
      {
        "components":[
          {"internalType":"address","name":"registeredby","type":"address"},
          {"internalType":"uint8","name":"stakeholder","type":"uint8"},
          {"internalType":"string","name":"kychash","type":"string"},
          {"internalType":"uint256","name":"starttime","type":"uint256"},
          {"internalType":"uint256","name":"endtime","type":"uint256"},
          {"internalType":"uint256","name":"time","type":"uint256"},
          {"internalType":"string","name":"touristID","type":"string"},
          {"internalType":"uint8","name":"status","type":"uint8"}
        ],
        "internalType":"struct KYC.Tourist",
        "name":"",
        "type":"tuple"
      }
    ],
    "stateMutability":"view",
    "type":"function"
  },
  // inactiveTourist
  {
    "inputs":[{"internalType":"string","name":"_touristID","type":"string"}],
    "name":"inactiveTourist",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  }
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    name: "sepolia",
    chainId: 11155111,
  });
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
  // fetch all events
  const filter = contract.filters.TouristRegistered();
  const events = await contract.queryFilter(filter, 0, "latest"); // from block 0
  const touristIDs = events.map(event => event.args._touristID);

  console.log(`Found ${touristIDs.length} tourist IDs on-chain.`);

  //  Check each ID
  for (const id of touristIDs) {
    try {
      const t = await contract.getTouristbyID(id);
      const now = Math.floor(Date.now() / 1000);

      if (t.status === 0 && now > t.endtime) { // 0 = Active
        console.log(`Tourist ${id} expired. Marking as Inactive...`);
        const tx = await contract.inactiveTourist(id);
        const receipt = await tx.wait();
        console.log(`Transaction confirmed: ${receipt.transactionHash}`);
      } else {
        console.log(`Tourist ${id} is still active or already inactive.`);
      }
    } catch (err) {
      console.error(`Error processing ${id}:`, err);
    }
  }
}

setInterval(main, 60 * 1000);
main(); // initial run