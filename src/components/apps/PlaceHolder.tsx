import { useState } from "react";
import { UserInfo } from "@web3auth/base";
import ConfettiExplosion from 'confetti-explosion-react';
import { Eoa } from "../Eoa";
import { SmartWallet } from "../SmartWallet";
import { Tasks } from "../Tasks";
import { useAppSelector } from "../../store/hooks";
import { GaslessWalletInterface } from "@gelatonetwork/gasless-onboarding";
import { Loading } from "../Loading";
interface PlaceHolderProps {
  connected: boolean;
  chainId: number;
  user: Partial<UserInfo> | null;
  wallet: { address: string; chainId: number } | null;
  smartWallet: GaslessWalletInterface | null;
  isDeployed: boolean;
  tokenId: string;
  ownerOf: string;
  lastMinter: string;
  isLoading: boolean;
  imageUrl: string;
  imageName:string;
  toggleConnect: () => {};
  mint: () => {};
}

const largeProps = {
  force: 0.6,
  duration: 5000,
  particleCount: 200,
  height: 1600,
  width: 1600
}

const PlaceHolderApp = (props: PlaceHolderProps) => {
  const tasks = useAppSelector((state) => state.tasks.tasks);

  return (

    <div>
         
      <div className="flex flex-row  justify-content-center align-items-center mt-5 mr-8 ml-8">
        <div className="card  bg-base-100 grow shadow-xl basis-1/5">
          <div
            style={{ alignItems: "center" }}
            className="card-body justify-content-center align-items-center"
          >
            <div className="flex flex-col justify-content-center align-items-center">
              <h2 className="text-2xl underline underline-offset-4 font-semibold text-white">
                {" "}
                Gelato Wallet Gasless Minting
              </h2>
            </div>
            {props.isLoading ? (
              <Loading />
            ) : (
              <button
                style={{ borderColor: "unset", color: "black" }}
                className="btn btn-primary mt-4 bg-gradient-to-r from-[#b45f63] to-[#f5c3a6] border-neutral-100 border-color"
                onClick={() => props.toggleConnect()}
              >
                {" "}
                {props.connected ? "Sign Out" : "Sign in"}
              </button>
            )}
          </div>

          {props.connected ? (
            <div className="card-body pt-1 flex-col justify-content-center align-items-center">
              <Eoa user={props.user} wallet={props.wallet} />
              <SmartWallet
                address={props.smartWallet?.getAddress()!}
                chainId={props.chainId}
                isDeployed={props.isDeployed}
              />

              <div className="mb-4 flex-column self-center">
              <h2 className="text-xl underline-offset-4  text-white">
                Token's already minted: {props.tokenId} 
                </h2>
                <button
                    style={{ borderColor: "unset", color: "black" }}
                    className="btn btn-primary mt-4 bg-gradient-to-r from-[#b45f63] to-[#f5c3a6] border-neutral-100"
                    onClick={() => props.mint()}
                  >
                    Mint
                  </button>
                {props.ownerOf == "0" ? (
                  <div>
                    <p>You don't have minted a token yet</p>
                  <button
                    style={{ borderColor: "unset", color: "black" }}
                    className="btn btn-primary mt-4 bg-gradient-to-r from-[#b45f63] to-[#f5c3a6] border-neutral-100"
                    onClick={() => props.mint()}
                  >
                    Mint
                  </button>
                  </div>
                ) : (
                <div className="mt-2">
                  <h3> Your Token : {props.imageName}</h3>
                  <img
                    width={250}
                    height={250}
                    style={{margin: " 20px auto"}}
                    src={`https://ipfs.io/ipfs/${props.imageUrl}`}
                  />
                </div>)}
              </div>
              {tasks.length > 0 && (
                <div className="flex flex-col pb-14">
                  <div className="mt-10 h-[0.1rem] bg-[#b45f63] opacity-20" />
                  <Tasks />
                </div>
              )}
            </div>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceHolderApp;
