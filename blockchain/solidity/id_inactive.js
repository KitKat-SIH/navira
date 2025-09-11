// install ethers first: npm install ethers dotenv
import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

// ==== CONFIG ====
const RPC_URL = process.env.RPC_URL; // Infura/Alchemy Sepolia URL
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Wallet private key
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const ABI = [
  // getAllTouristIDs
  {
    inputs: [],
    name: "getAllTouristIDs",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  // getTouristbyID
  {
    inputs: [{ internalType: "string", name: "_touristID", type: "string" }],
    name: "getTouristbyID",
    outputs: [
      {
        components: [
          { internalType: "address", name: "registeredby", type: "address" },
          { internalType: "uint8", name: "stakeholder", type: "uint8" },
          { internalType: "string", name: "kychash", type: "string" },
          { internalType: "uint256", name: "starttime", type: "uint256" },
          { internalType: "uint256", name: "endtime", type: "uint256" },
          { internalType: "uint256", name: "time", type: "uint256" },
          { internalType: "string", name: "touristID", type: "string" },
          { internalType: "uint8", name: "status", type: "uint8" },
        ],
        internalType: "struct KYC.Tourist",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // inactiveTourist
  {
    inputs: [{ internalType: "string", name: "_touristID", type: "string" }],
    name: "inactiveTourist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function main() {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL, {
      name: "sepolia",
      chainId: 11155111,
    });
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

    console.log("Fetching all tourist IDs...");

    // Get all tourist IDs using the new function
    const touristIDs = await contract.getAllTouristIDs();

    console.log(`Found ${touristIDs.length} tourist IDs on-chain.`);

    if (touristIDs.length === 0) {
      console.log("No tourists found.");
      return;
    }

    // Check each ID
    let processedCount = 0;
    let inactivatedCount = 0;

    for (const id of touristIDs) {
      try {
        console.log(`\nProcessing tourist ID: ${id}`);
        const tourist = await contract.getTouristbyID(id);
        const now = Math.floor(Date.now() / 1000);
        const endTime = Number(tourist.endtime);
        const status = Number(tourist.status);

        console.log(
          `- Status: ${
            status === 0 ? "Active" : status === 1 ? "Inactive" : "Suspended"
          }`
        );
        console.log(`- End time: ${new Date(endTime * 1000).toISOString()}`);
        console.log(`- Current time: ${new Date(now * 1000).toISOString()}`);
        console.log(`- Expired: ${now > endTime ? "Yes" : "No"}`);

        // Check if tourist is active and has expired
        if (status === 0 && now > endTime) {
          // 0 = Active
          console.log(`Tourist ${id} has expired. Marking as Inactive...`);
          const tx = await contract.inactiveTourist(id);
          console.log(`Transaction sent: ${tx.hash}`);
          const receipt = await tx.wait();
          console.log(
            `✅ Tourist ${id} marked as inactive. Transaction: ${receipt.transactionHash}`
          );
          inactivatedCount++;
        } else if (status === 0 && now <= endTime) {
          console.log(`Tourist ${id} is still active and valid.`);
        } else {
          console.log(`Tourist ${id} is already inactive or suspended.`);
        }

        processedCount++;
      } catch (err) {
        console.error(`❌ Error processing tourist ${id}:`, err.message);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`- Total tourists processed: ${processedCount}`);
    console.log(`- Tourists marked as inactive: ${inactivatedCount}`);
  } catch (error) {
    console.error("❌ Main function error:", error.message);
  }
}

// Run the check every 5 minutes (300,000 ms)
console.log("🚀 Starting Tourist ID Status Checker...");
console.log("Will check every 5 minutes for expired tourist IDs");

setInterval(() => {
  console.log("\n⏰ Running scheduled check...");
  main();
}, 5 * 60 * 1000);

// Run immediately on startup
main();
