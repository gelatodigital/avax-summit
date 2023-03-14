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
import * as dotenv from "dotenv";
import axios from "axios";
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
import ConfettiExplosion from "confetti-explosion-react";

const nftAddres="0x105246C20C61002C7f26eABFEbE90641D234F995"

const largeProps = {
  force: 0.6,
  duration: 5000,
  particleCount: 200,
  height: 1600,
  width: 1600
}

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tokenId, setTokenId] = useState<string>("0");
  const [ownerOf, setAlreadyOwnerId] = useState<string>("0");
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
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const [isExploding, setExploding] = useState(false);
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
    setIsLoading(true);
   // setExploding(false)
    // setExploding(true)

    // setTimeout(()=> {
    //   setExploding(false)
    // },5000)
    const { data } =  await contract!.populateTransaction.mint();
    let tx = await smartWallet?.sponsorTransaction(
      nftAddres,
      data!
    )

    // console.log(data)
      console.log(tx)

    setIsLoading(false)
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
        const smartWalletConfig: GaslessWalletConfig = {
          apiKey: "w6GRnNDpTnmKHo4o9ckQ_m_JDpgZOUyTrNwgz5TemBM_",
        };
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
        nftAddres,
        NFT_ABI,
        new ethers.providers.Web3Provider(web3AuthProvider!).getSigner()
      );

      contract.on('MintEvent', async (_tokenId:any) => {
        console.log(_tokenId)
       console.log('mintied')
      });

      contract.on('MetadataUpdate', async (_tokenId:any) => {
       
       console.log(_tokenId)
      });

      setContract(contract);
      setConnected(true);



      
    const currentTokenId = (await contract.tokenIds()).toString();
    console.log(currentTokenId);

    const alreadyOwnerId = (
      await contract.tokenIdByUser(gelatoSmartWallet.getAddress())
    ).toString();
    console.log(alreadyOwnerId);

  

    setAlreadyOwnerId(alreadyOwnerId);
    setTokenId(currentTokenId);

    if (alreadyOwnerId != "0") {
      console.log(alreadyOwnerId != "0")
      let ipfs = await contract.tokenURI(1);
      console.log(ipfs)
  
      let url = ipfs.replace('ipfs://',"")
  
      let res = await axios.get(
        `https://nftstorage.link/ipfs/${url}`
      );
  
      const persons = res.data;

      console.log(persons.name)
      console.log(persons.image);
      setImageName(persons.name)
      setImageUrl(persons.image.replace('ipfs://',""))
    }
   


 


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
      <div className="flex justify-center">
      { isExploding && <ConfettiExplosion {...largeProps}  />}
      </div>
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
        imageUrl={imageUrl}
        imageName={imageName}
        isLoading={isLoading}
        toggleConnect={toggleConnect}
        mint={mint}
      />
    </div>
  );
}

export default App;
