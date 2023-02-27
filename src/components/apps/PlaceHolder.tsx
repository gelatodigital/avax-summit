import { useState } from "react";
import { UserInfo } from "@web3auth/base";
import {} from "../../App";
import { Eoa } from "../Eoa";
import { SmartWallet } from "../SmartWallet";
interface PlaceHolderProps {
  connected: boolean;
  chainId: number;
  user: Partial<UserInfo> | null;
  wallet: { address: string; chainId: number } | null;
  toggleConnect: () => {};
}

const PlaceHolderApp = (props: PlaceHolderProps) => {
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
            { props.connected ?  (<div className="card-body flex-col justify-content-center align-items-center">
              <h2 className="card-title">{props.connected}</h2>
             
            <Eoa user={props.user} wallet={props.wallet} />
            <SmartWallet
              address={props.wallet?.address!}
              chainId={props.chainId}
              isDeployed={props.connected}
            />
      
          <div className="mb-4  self-center">
            Token Nr
            <p
              style={{
                height: "30px",
                background: props.connected ? "green" : "red",
                width: "30px",
                borderRadius: "20px",
                margin: "auto",
              }}
            ></p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => props.toggleConnect()}
            >
              {" "}
              {props.connected ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>) : (<p></p>)}
      </div>
      </div>
    </div>
  );
};

export default PlaceHolderApp;
