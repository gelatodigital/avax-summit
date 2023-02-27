
// import { time } from "@nomicfoundation/hardhat-network-helpers";
import { join} from 'path';
import {copyFileSync, writeFileSync,  ensureDirSync, copySync} from 'fs-extra'

import { initEnv } from "../helpers/utils";
import * as hre from 'hardhat';
import { BigNumber } from "ethers";
import { GelatoWalletNft__factory } from '../typechain-types/factories/contracts/GelatoWalletNft__factory'


const contract_path_relative = '../src/blockchain';
const processDir = process.cwd()
const contract_path = join(processDir,contract_path_relative)
ensureDirSync(contract_path)



async function main() {


  const [deployer] = await initEnv(hre);

  let nonce = await deployer.getTransactionCount();

  const gelatoWalletNft = await new  GelatoWalletNft__factory(deployer).deploy({gasLimit:10000000, nonce});
  
  let metadata = {
    address: gelatoWalletNft.address,
    abi:GelatoWalletNft__factory.abi
  }

  writeFileSync(join(contract_path,'contracts','gelatoWalletNft-metadata.json'),JSON.stringify(metadata));

  copySync(
    `./typechain-types/contracts/GelatoWalletNft.ts`,
    join(contract_path, 'contracts', `GelatoWalletNft.ts`)
  );

  console.log(`GelatoWalletNft Contract created at ${gelatoWalletNft.address} `)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

