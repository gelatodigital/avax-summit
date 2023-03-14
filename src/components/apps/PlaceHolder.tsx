import { useState } from "react";
import { UserInfo } from "@web3auth/base";

import { Eoa } from "../Eoa";
import { SmartWallet } from "../SmartWallet";
import { Tasks } from "../Tasks";
import { useAppSelector } from "../../store/hooks";
import { GaslessWalletInterface } from "@gelatonetwork/gasless-onboarding";
interface PlaceHolderProps {
  connected: boolean;
  chainId: number;
  user: Partial<UserInfo> | null;
  wallet: { address: string; chainId: number } | null;
  smartWallet: GaslessWalletInterface | null;
  isDeployed:boolean;
  tokenId:string;
  ownerOf:string;
  lastMinter:string;
  toggleConnect: () => {};
  mint:()=> {}
}

const PlaceHolderApp = (props: PlaceHolderProps) => {
  const tasks = useAppSelector((state) => state.tasks.tasks)
  console.log(props)
  return (
    <div>
      <div className="flex flex-row  justify-content-center align-items-center mt-5 mr-8 ml-8">
        <div className="card  bg-base-100 grow shadow-xl basis-1/5">
          <div
            style={{ alignItems: "center" }}
            className="card-body justify-content-center align-items-center"
          >
            <div className="flex flex-col justify-content-center align-items-center">
              <h2 className="text-2xl underline underline-offset-4 font-semibold text-white">Gelato Wallet Gasless Minting</h2>
            </div>
            <button style={{borderColor:'unset', color:'black'}}
              className="btn btn-primary mt-4 bg-gradient-to-r from-[#b45f63] to-[#f5c3a6] border-neutral-100 border-color"
              onClick={() => props.toggleConnect()}
            >
              {" "}
              {props.connected ? "Sign Out" : "Sign in"}
            </button>
            </div>
            { props.connected ?  (<div className="card-body pt-1 flex-col justify-content-center align-items-center">
             
            <Eoa  user={props.user} wallet={props.wallet} />
            <SmartWallet
              address={props.smartWallet?.getAddress()!}
              chainId={props.chainId}
              isDeployed={props.isDeployed}
            />
      
          <div className="mb-4  self-center">
            Current Token {props.tokenId}
            <p
              style={{
                height: "30px",
                background: props.connected ? "green" : "red",
                width: "30px",
                borderRadius: "20px",
                margin: "auto",
              }}
            ></p>
       
            { props.ownerOf == "0" && (
            <button style={{borderColor:'unset', color:'black'}}
              className="btn btn-primary mt-4 bg-gradient-to-r from-[#b45f63] to-[#f5c3a6] border-neutral-100"
              onClick={() => props.mint()}
            >
              Mint
            </button>)
          }
         <img src="https://ipfs.io/ipfs/QmQqzMTavQgT4f4T5v6PWBp7XNKtoPmC9jvn12WPT3gkSE" />
          </div>
          {tasks.length > 0 && (
        <div className="flex flex-col pb-14">
          <div className="mt-10 h-[0.1rem] bg-[#b45f63] opacity-20" />
          <Tasks />
        </div>
      )}
        </div>) : (<p></p>)}
      </div>
      </div>
    </div>
  );
};

export default PlaceHolderApp;
