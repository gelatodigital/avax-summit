import React from "react";
import { ethers } from "ethers";
import NFTDropABI from "../../assets/abi/NFTDrop.json";
import { GelatoRelay, SponsoredCallRequest } from "@gelatonetwork/relay-sdk";
import CounterPopup from "../effects/CounterPopup";
// import * as dotenv from "dotenv";

import {
  useAddress,
  useContract,
  useChainId,
  useNFTs,
} from "@thirdweb-dev/react";

import { useEffect, useState } from "react";

const target = "0x7a97a9C679605b55d3DA0B2810D3447c0F574DE3";

const GaslessNFTApp = () => {
  // Process Env Variables
  // dotenv.config({ path: __dirname + "/.env" });
  // const GELATO_API_KEY = process.env.GELATO_API_KEY as string;

  const [initiated, setInitiated] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [taskStatus, setTaskStatus] = useState("N/A");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  // misc state
  const [popup, setPopup] = useState(false);
  const [nextNFTUrl, setNextNFTUrl] = useState("");

  // third web blockchain hooks/data
  const address = useAddress();
  const chainId = useChainId();

  // contract object instantiate
  const { contract, isLoading } = useContract(target, "nft-drop");
  const { data: nfts } = useNFTs(contract, { start: 0, count: 20 });

  useEffect(() => {
    const getNextNFT = async (contract, nfts) => {
      const claimedNFTCount = await contract.totalClaimedSupply();
      const nextNFTIndex = claimedNFTCount.toNumber() + 1;
      setNextNFTUrl(nfts[nextNFTIndex].metadata.image);
    };

    getNextNFT(contract, nfts);
  }, [address, contract, nfts]);

  const sendRelayRequest = async () => {
    // update state
    setInitiated(true);
    setPopup(false);
    setTaskId("");
    setStartTime(0);
    setTaskStatus("Loading...");

    // instantiating Gelato Relay SDK
    const relay = new GelatoRelay();

    // connecting to contract through front-end provider
    // const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    // const signer = provider.getSigner();
    // const contract = new ethers.Contract(target, NFTDropABI, signer);

    // relay request parameters
    const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
    const iface = new ethers.utils.Interface(NFTDropABI);
    const allowListProof = [
      [ethers.constants.HashZero],
      ethers.constants.MaxUint256,
      0,
      feeToken,
    ];
    const data = iface.encodeFunctionData("claim", [
      address,
      1,
      feeToken,
      0,
      allowListProof,
      ethers.constants.HashZero,
    ]);

    if (!chainId || !data) return;

    const sponsorAPIkey = "eBrcJ2VJZiI33M_2lVr_JPCM_UsSWdqMO6ztpXRKVY0_";

    const request: SponsoredCallRequest = {
      chainId,
      target,
      data,
    };

    const relayResponse = await relay.sponsoredCall(request, sponsorAPIkey);
    console.log("relayResponsse: " + relayResponse);
    setTaskId(relayResponse.taskId);
    setStartTime(Date.now());
  };

  useEffect(() => {
    let statusQuery;
    let popupTimer;
    if (taskId === "") return;

    const getTaskState = async () => {
      try {
        const url = `https://relay.gelato.digital/tasks/status/${taskId}`;
        const response = await fetch(url);
        const responseJson = await response.json();
        setTaskStatus(responseJson.task.taskState);
      } catch (error) {
        console.error(error);
      }
    };

    if (taskStatus !== "ExecSuccess") {
      statusQuery = setInterval(() => {
        getTaskState();
      }, 1500);
    } else {
      setEndTime(Date.now() - startTime);
      setPopup(true);
      setInitiated(false);
    }

    popupTimer = setTimeout(() => {
      setPopup(false);
    }, 3000);

    return () => {
      clearInterval(statusQuery);
      clearTimeout(popupTimer);
    };
  }, [taskId, taskStatus, startTime, endTime]);

  return (
    <div className="flex flex-row justify-center mt-5 mr-8 ml-8">
      <div className="card w-96 bg-base-100 shadow-xl basis-1/5">
        <div className="card-body">
          <div className="flex flex-col">
            <h2 className="card-title">Gasless NFT Drop</h2>
          </div>
          <div className="mb-4 self-start">
            Next available NFT:{" "}
          </div>
          <div>
            {!address ? (
              "Waiting for wallet"
            ) : (
              <img className="rounded-full" src={nextNFTUrl} alt="Gasless NFT" />
            )}
          </div>
          <div>
            <p>
              {" "}
              <b>
                {" "}
                {address && chainId === 80001
                  ? ""
                  : "Connect your wallet to Mumbai to begin"}{" "}
              </b>{" "}
            </p>
          </div>
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary"
              disabled={!(address && chainId === 80001)}
              onClick={sendRelayRequest}
            >
              {initiated && taskStatus !== "ExecSuccess"
                ? "Gelato go brr"
                : "Claim NFT"}
            </button>
          </div>
        </div>
      </div>
      <div className="card w-96 bg-base-100 grow shadow-xl basis-1/5 ml-6">
        <div className="card-body">
          <div className="flex flex-col items-start  space-y-2">
            <h2 className="card-title">Gasless NFT Status Poller</h2>
            <p className="break-words">
              <b>Task ID:</b>{" "}
              <a
                href={`https://relay.gelato.digital/tasks/status/${taskId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                {taskId !== "" ? taskId : "Waiting for Relay Request"}{" "}
              </a>
            </p>
            <p className="self-start">
              <b>Status:</b> {isLoading ? "Loading..." : taskStatus}
            </p>
            <p className="self-start">
              <b>Execution Time:</b>{" "}
              {initiated ? "Calculating..." : endTime / 1000 + "s"}
            </p>
          </div>
        </div>
        <div className="animate-pulse">{popup ? <CounterPopup /> : ""}</div>
      </div>
    </div>
  );
};

export default GaslessNFTApp;
