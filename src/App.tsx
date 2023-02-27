import "./App.css";
import NavBar from "./components/NavBar";
import { resolve } from "path";
import useTitle from "./hooks/useTitle";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { ethers } from "ethers";
import { addTask } from "./store/slices/taskSlice";
import { addError } from "./store/slices/errorSlice";
import PlaceHolderApp from "./components/apps/PlaceHolder";
import { GelatoWalletNft } from "./blockchain/contracts/GelatoWalletNft";
import GelatoWalletNftMetadata from "./blockchain/contracts/gelatoWalletNft-metadata.json";
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


function App() {
  const tasks = useAppSelector((state) => state.tasks.tasks)
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
  const [tokenId, setTokenId] = useState<string|null>();
  const [lastminter, setLastMinter] = useState<string|null>();
  const [web3AuthProvider, setWeb3AuthProvider] =
    useState<SafeEventEmitterProvider | null>(null);
  const [smartWallet, setSmartWallet] = useState<GaslessWalletInterface | null>(
    null
  );
  const [connected, setConnected] = useState(false);

  const [chainId, setChainId] = useState(0);
  const [signer, setSigner] = useState<any>(null);

  const [contract, setContract] =
    useState<GelatoWalletNft| null>(null);
  const [user, setUser] = useState<Partial<UserInfo> | null>(null);
  const [wallet, setWallet] = useState<{
    address: string;
    balance: string;
    chainId: number;
  } | null>(null);
  const [isDeployed, setIsDeployed] = useState<boolean>(false);

let network: 'mumbai' | 'localhost' = "localhost"; // 'mumbai';// "localhost"; // 


console.log(115)



  const toggleConnect= async () => {
   
    if (connected == true){
      connectButton()
    } else {
      logout()
    }

  };

  const mint = async () => {
    let tx = await contract!.mint()
    await tx.wait();

  }

  const connectButton= async () => {
    dispatch(addTask('taskId'));

    // if (!gelatoLogin) {
    //   return;
    // }
    // const web3authProvider = await gelatoLogin.login();
    // setWeb3AuthProvider(web3authProvider);
  };

  const logout = async () => {
    if (!gelatoLogin) {
      return;
    }
    await gelatoLogin.logout();
    setWeb3AuthProvider(null);
    // setWallet(null);
    // setUser(null);
    setSmartWallet(null);
    // setCounterContract(null);
  };


  const fetchStatus = async () => {
    if (!contract || !smartWallet) {
      return;
    }
    const tokenId = (await contract.tokenId).toString();
    const lastMinter = (await contract.senderWallet)
    setTokenId(tokenId);
    setIsDeployed(await smartWallet!.isDeployed());
  };

  useEffect(() => {
    setConnected(true)
    console.log(connected)

   })


  useEffect(() => {
    const init = async () => {
      console.log(80)
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(window.location.search);
        console.log(queryParams,83)
        const chainIdParam = queryParams.get("chainId");
        const { apiKey, chainId, target, rpcUrl } =
          getChainConfig(chainIdParam);
          console.log(chainId)
        const smartWalletConfig: GaslessWalletConfig = { apiKey };
        const loginConfig: LoginConfig = {
          chain: {
            id: 80001,
            rpcUrl:"https://polygon-mumbai.g.alchemy.com/v2/P2lEQkjFdNjdN0M_mpZKB8r3fAa2M0vT",
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
   // init();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!gelatoLogin || !web3AuthProvider) {
        console.log(121)
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
      console.log(wallet)
      const user = await gelatoLogin.getUserInfo();
      setUser(user);
      console.log(user);
      const gelatoSmartWallet = gelatoLogin.getGaslessWallet();
      setSmartWallet(gelatoSmartWallet);
      setIsDeployed(await gelatoSmartWallet.isDeployed());
      const contract = new ethers.Contract(
        GelatoWalletNftMetadata.address,
        GelatoWalletNftMetadata.abi,
        new ethers.providers.Web3Provider(web3AuthProvider!).getSigner() 
      ) as GelatoWalletNft;
      setContract(contract);
      setConnected(true)
  
      await fetchStatus();
      const interval = setInterval(fetchStatus, 5000);
      setIsLoading(false);
      return () => clearInterval(interval);
    };
    //init();
  }, [web3AuthProvider]);

  useTitle("create-gelato-gasless-walelt-dapp");


  return (
    <div className="App bg-slate-600 h-screen flex flex-col content-center">
      <NavBar
      />
      <PlaceHolderApp
        lastMinter={lastminter!}
        tokenId={tokenId!}
        user={user}
        wallet={wallet}
        connected={connected}
        chainId={chainId}
        toggleConnect={toggleConnect}
        mint={mint}
      />
     
 
    </div>
  );
}

export default App;
