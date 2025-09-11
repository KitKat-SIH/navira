// install ethers first: npm install ethers dotenv node-fetch
import { ethers } from "ethers";
import fetch from "node-fetch";
import * as dotenv from "dotenv";
dotenv.config();

// ==== CONFIG ====
const RPC_URL = process.env.RPC_URL; // Infura/Alchemy Sepolia URL
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Wallet private key
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const ABI = [
  // registertourist
  {
    "inputs":[
      {"internalType":"string","name":"_kychash","type":"string"},
      {"internalType":"string","name":"_touristID","type":"string"},
      {"internalType":"uint256","name":"_tourtime","type":"uint256"},
      {"internalType":"uint8","name":"_stakeholder","type":"uint8"},
      {"internalType":"uint8","name":"_idstatus","type":"uint8"}
    ],
    "name":"registertourist",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  // event TouristRegistered
  {
    "anonymous": false,
    "inputs":[
      {"indexed": false,"internalType":"string","name":"_touristID","type":"string"}
    ],
    "name":"TouristRegistered",
    "type":"event"
  }
];

// Fetch tourist ID from your Go API
async function getTouristID() {
    const res = await fetch("http://localhost:8080/generate");
    const data = await res.json();
    return data.touristID;
}

async function main() {
  // 1. Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    name: "sepolia",
    chainId: 11155111,
  });
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // 2. Connect to contract
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  // 3. Generate tourist ID
  const touristID = await getTouristID();
  console.log("Generated Tourist ID:", touristID);

  // 4. Inputs
  const kycHash = "QmXyz123HashFromIPFS";  // replace with actual KYC hash  
  const tourTime = 60 * 60 * 24 * 7;       // 7 days in seconds
  const stakeholder = 0;                   // Stakeholder enum -> TO=0
  const idStatus = 0;                      // IDStatus enum -> Active=0

  console.log("Sending transaction to register tourist...");

  // 5. Send transaction
  const tx = await contract.registertourist(
    kycHash,
    touristID,
    tourTime,
    stakeholder,
    idStatus
  );

  console.log("Transaction sent:", tx.hash);

  // 6. Wait for confirmation
  const receipt = await tx.wait();
  console.log("Transaction confirmed in block:", receipt.blockNumber);

  // Optional: listen for the event
  contract.on("TouristRegistered", (_touristID) => {
    console.log(`Event emitted: TouristRegistered -> ${_touristID}`);
  });
}

main().catch((err) => {
  console.error("Error:", err);
});