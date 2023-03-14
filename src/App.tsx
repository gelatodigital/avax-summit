import "./App.css";
import NavBar from "./components/NavBar";
import { resolve } from "path";
import useTitle from "./hooks/useTitle";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Contract, ethers } from "ethers";
import { addTask } from "./store/slices/taskSlice";
import { addError } from "./store/slices/errorSlice";
import PlaceHolderApp from "./components/apps/PlaceHolder";
import { NFTStorage, File } from "nft.storage";
import * as dotenv from "dotenv";
import {
  GaslessOnboarding,
  GaslessWalletConfig,
  GaslessWalletInterface,
  LoginConfig,
} from "@gelatonetwork/gasless-onboarding";
import { SafeEventEmitterProvider, UserInfo } from "@web3auth/base";
import { getChainConfig } from "./utils";
import { Tasks } from "./components/Tasks";
import { NFT_ABI } from "./constants";
import { current } from "@reduxjs/toolkit";
import { Web3Storage} from 'web3.storage'


function App() {
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const error = useAppSelector((state) => state.error.message);
  const dispatch = useAppDispatch();
  const [gelatoLogin, setGelatoLogin] = useState<
    GaslessOnboarding | undefined
  >();

  const [contractConfig, setContractConfig] = useState<{
    chainId: number;
    target: string;
  }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState<string>("0");
  const [ownerOf, setAlreadyOwnerId]  = useState<string>("0");
  const [lastminter, setLastMinter] = useState<string | null>();
  const [web3AuthProvider, setWeb3AuthProvider] =
    useState<SafeEventEmitterProvider | null>(null);
  const [smartWallet, setSmartWallet] = useState<GaslessWalletInterface | null>(
    null
  );
  const [connected, setConnected] = useState(false);

  const [chainId, setChainId] = useState(0);
  const [signer, setSigner] = useState<any>(null);

  const [contract, setContract] = useState<Contract | null>(null);
  const [user, setUser] = useState<Partial<UserInfo> | null>(null);
  const [wallet, setWallet] = useState<{
    address: string;
    balance: string;
    chainId: number;
  } | null>(null);
  const [isDeployed, setIsDeployed] = useState<boolean>(false);

  let network: "localhost" | "localhost" = "localhost"; // 'mumbai';// "localhost"; //

  console.log(115);

  const toggleConnect = async () => {
    if (connected == true) {
      logout();
    } else {
      connectButton();
    }
  };

  const mint = async () => {
   // setIsLoading(true)
  // const { data } =  await contract!.mint()
  const { data } =  await contract!.populateTransaction.mint();
  let tx = await smartWallet?.sponsorTransaction(
    "0x62745D2235c932739A6d11078173c487413B2F68",
    data!
  )

  console.log(data)
   console.log(tx)
  // let tx = await this.gelatoSmartWallet.sponsorTransaction(
  //   this.gaslessMinting.address,
  //   data!
  // );
    // let tx = await contract!.mint();
    // await tx.wait();
    //setIsLoading(false)
  };

  const connectButton = async () => {
    // dispatch(addTask('taskId'));

    if (!gelatoLogin) {
      return;
    }
    const web3authProvider = await gelatoLogin.login();
    setWeb3AuthProvider(web3authProvider);
  };

  const logout = async () => {
    if (!gelatoLogin) {
      return;
    }
    await gelatoLogin.logout();
    setWeb3AuthProvider(null);
    setWallet(null);
    setUser(null);
    setSmartWallet(null);
    setContract(null);
  };

  const fetchStatus = async () => {
    if (!contract || !smartWallet) {
      return;
    }

 
    const currentTokenId = (await contract.tokenIds()).toString();
    console.log(currentTokenId)

    // const lastMinter = (await contract.senderWallet)
    // setTokenId(currentTokenId);
    //setIsDeployed(await smartWallet!.isDeployed());
  };

  useEffect(() => {
    //setConnected(true)
    console.log(connected);
  });

  useEffect(() => {
    const init = async () => {
      console.log(80);
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const chainIdParam = queryParams.get("chainId");
        const { apiKey, chainId, target, rpcUrl } =
          getChainConfig(chainIdParam);
        console.log(chainId);
        const smartWalletConfig: GaslessWalletConfig = { apiKey:"w6GRnNDpTnmKHo4o9ckQ_m_JDpgZOUyTrNwgz5TemBM_" };
        const loginConfig: LoginConfig = {
          chain: {
            id: 80001,
            rpcUrl:
              "https://polygon-mumbai.g.alchemy.com/v2/P2lEQkjFdNjdN0M_mpZKB8r3fAa2M0vT",
          },
          ui: {
            theme: "dark",
          },
          openLogin: {
            redirectUrl: `${window.location.origin}`,
          },
        };
        const gelatoLogin = new GaslessOnboarding(
          loginConfig,
          smartWalletConfig
        );
        console.log(104);
        setContractConfig({ chainId, target });
        await gelatoLogin.init();
        console.log(108);
        setGelatoLogin(gelatoLogin);
        const provider = gelatoLogin.getProvider();
        console.log(provider);
        if (provider) {
          console.log(110);
          setWeb3AuthProvider(provider);
        }
      } catch (error) {
        dispatch(addError((error as Error).message));
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!gelatoLogin || !web3AuthProvider) {
        console.log(121);
        return;
      }

      setIsLoading(true);
      const web3Provider = new ethers.providers.Web3Provider(web3AuthProvider!);
      const signer = web3Provider.getSigner();
      setWallet({
        address: await signer.getAddress(),
        balance: (await signer.getBalance()).toString(),
        chainId: await signer.getChainId(),
      });
      console.log(wallet);
      const user = await gelatoLogin.getUserInfo();
      setUser(user);
      console.log(user);
      const gelatoSmartWallet = gelatoLogin.getGaslessWallet();
      setSmartWallet(gelatoSmartWallet);
      setIsDeployed(await gelatoSmartWallet.isDeployed());
      const contract = new ethers.Contract(
        "0x62745D2235c932739A6d11078173c487413B2F68",
        NFT_ABI,
        new ethers.providers.Web3Provider(web3AuthProvider!).getSigner()
      );
   

      setContract(contract);
      setConnected(true);



      await fetchStatus();
      const currentTokenId = (await contract.tokenIds()).toString();
      const alreadyOwnerId = (await contract.tokenIdByUser(gelatoSmartWallet.getAddress())).toString()
      console.log(alreadyOwnerId)
      setAlreadyOwnerId(alreadyOwnerId)
      setTokenId(currentTokenId);
      const nftStorageApiKey = "eeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU3ZjkyOWE2QzZkRDJkQTI5NmUyQmI2NENCNjlBMTIwQzlDNjJEODAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0OTQzNTI0MjIzNSwibmFtZSI6ImNsaWNrVG9EYW8ifQ.mx1vdaE-4wMbB4NBHTgCc56nhtkw6fmoRTxzu1x26lI";
      const WEB3_STORAGE_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY4NGEzRDUxNGE4ZjgzN0Q3NDkxZTlFZDUwNjJjNzg3YkFlRkQ1NDIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDk0MzQ5NDY4MzcsIm5hbWUiOiJjbGlja1RvRGFvIn0.E9yLGpgtYb05VSNVgrUeFc5a_BP5uf_2THChjlIf73g";

      const client = new NFTStorage({ token: nftStorageApiKey });
      const storage = new Web3Storage({ token:WEB3_STORAGE_KEY})
     // let p = await storage.get('bafyreicwi7sbomz7lu5jozgeghclhptilbvvltpxt3hbpyazz5zxvqh62m/metadata.json')
      let ss= await storage.get('bafybeicoi6wzyvmo5hbtvuahmoj6oqriys4fkopxcocitlx3s6nnesxwxu/gelato_bot_not_revealed.png')
      
     // console.log(await p?.json())

   

      
     //let metadata = await client.check('bafyreicwi7sbomz7lu5jozgeghclhptilbvvltpxt3hbpyazz5zxvqh62m/metadata.json')

       // console.log(metadata)

      const interval = setInterval(fetchStatus, 5000);
      setIsLoading(false);
      return () => clearInterval(interval);
    };
    init();
  }, [web3AuthProvider]);

  useTitle("create-gelato-gasless-walelt-dapp");

  return (
    <div className="App bg-slate-600 h-screen flex flex-col content-center">
      <NavBar />
      <PlaceHolderApp
        lastMinter={lastminter!}
        tokenId={tokenId}
        ownerOf={ownerOf}
        user={user}
        wallet={wallet}
        smartWallet={smartWallet}
        isDeployed={isDeployed}
        connected={connected}
        chainId={chainId}
        toggleConnect={toggleConnect}
        mint={mint}
      />
    </div>
  );
}

export default App;
