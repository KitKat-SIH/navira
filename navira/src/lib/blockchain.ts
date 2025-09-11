import { ethers } from 'ethers';
import abi from '../contracts/KYC.json';

type RegisterParams = {
  providerUrl: string;
  privateKey: string;
  contractAddress: string;
};

export function getContract({ providerUrl, privateKey, contractAddress }: RegisterParams) {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(contractAddress, abi as any, wallet);
}

export async function registerTourist(
  params: RegisterParams,
  {
    kycHash,
    touristID,
    tourTimeSeconds,
    stakeholder = 0,
    idStatus = 0,
  }: { kycHash: string; touristID: string; tourTimeSeconds: number; stakeholder?: number; idStatus?: number }
) {
  const contract = getContract(params);
  const tx = await contract.registertourist(kycHash, touristID, tourTimeSeconds, stakeholder, idStatus);
  const receipt = await tx.wait();
  return receipt;
}

export async function inactiveIfExpired(params: RegisterParams, touristIDs: string[]) {
  const contract = getContract(params);
  for (const id of touristIDs) {
    const t = await contract.getTouristbyID(id);
    const now = Math.floor(Date.now() / 1000);
    if (t.status === 0 && now > Number(t.endtime)) {
      await (await contract.inactiveTourist(id)).wait();
    }
  }
}


