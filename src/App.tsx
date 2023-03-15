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

const nftAddres = "0xD47c74228038E8542A38e3E7fb1f4a44121eE14E"//"0x8Ba4F4e109F24c4Fbc871A0A5795DaDebF14565b";

const largeProps = {
  force: 0.6,
  duration: 5000,
  particleCount: 200,
  height: 1600,
  width: 1600,
};

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
  const [nftTime, setNftTime] = useState<string>("By Night");
  const [isExploding, setExploding] = useState(false);
  let network: "localhost" | "localhost" = "localhost"; // 'mumbai';// "localhost"; //

  const toggleConnect = async () => {
    if (connected == true) {
      logout();
    } else {
      connectButton();
    }
  };

  const selectTime = async (value: any) => {
  
    setNftTime(value.value);
  };

  const mint = async () => {
    setIsLoading(true);

  

    const nftTimeFlag = nftTime == 'By Day' ? false : true;

  

    const { data } = await contract!.populateTransaction.mint(nftTimeFlag);
    let tx = await smartWallet?.sponsorTransaction(nftAddres, data!);

    console.log(tx);
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
    setAlreadyOwnerId("0");
    setTokenId("0");
    setImageName("");
    setImageUrl("");
    setConnected(false);
  };

  const refresh = async (_tokenId: number) => {
    let ipfs = await contract!.tokenURI(_tokenId);

    let url = ipfs.replace("ipfs://", "");

    let res = await axios.get(`https://nftstorage.link/ipfs/${url}`);

    const persons = res.data;

    setImageName(persons.name);
    setImageUrl(persons.image.replace("ipfs://", ""));
  };

  const fetchStatus = async () => {
    if (!contract || !smartWallet) {
      return;
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const chainIdParam = queryParams.get("chainId");
        const { apiKey, chainId, target, rpcUrl } =
          getChainConfig(chainIdParam);

        const smartWalletConfig: GaslessWalletConfig = {
          apiKey: "SPONSOR_KEY"
        };
        const loginConfig: LoginConfig = {
          chain: {
            id: 137,
            rpcUrl: "RPC"
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

        setContractConfig({ chainId, target });
        await gelatoLogin.init();

        setGelatoLogin(gelatoLogin);
        const provider = gelatoLogin.getProvider();

        if (provider) {
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

      const user = await gelatoLogin.getUserInfo();
      setUser(user);

      const gelatoSmartWallet = gelatoLogin.getGaslessWallet();
      setSmartWallet(gelatoSmartWallet);
      setIsDeployed(await gelatoSmartWallet.isDeployed());
      const contract = new ethers.Contract(
        nftAddres,
        NFT_ABI,
        new ethers.providers.Web3Provider(web3AuthProvider!).getSigner()
      );

      contract.on("MintEvent", async (_tokenId: any) => {
        const alreadyOwnerId = (
          await contract.tokenIdByUser(gelatoSmartWallet.getAddress())
        ).toString();
        const currentTokenId = (await contract.tokenIds()).toString();
        setTokenId(currentTokenId);
        if (alreadyOwnerId == _tokenId.toString()) {
          setAlreadyOwnerId(alreadyOwnerId);
          let ipfs = await contract!.tokenURI(+alreadyOwnerId);

          let url = ipfs.replace("ipfs://", "");

          let res = await axios.get(`https://nftstorage.link/ipfs/${url}`);

          setIsDeployed(await gelatoSmartWallet!.isDeployed());

          const persons = res.data;
          setImageName(persons.name);
          setImageUrl(persons.image.replace("ipfs://", ""));

          setIsLoading(false);
          setExploding(false);
          setExploding(true);

          setTimeout(() => {
            setExploding(false);
          }, 5000);
        }
      });

      contract.on("MetadataUpdate", async (_tokenId: any) => {
        const alreadyOwnerId = (
          await contract.tokenIdByUser(gelatoSmartWallet.getAddress())
        ).toString();
        const currentTokenId = (await contract.tokenIds()).toString();
        setTokenId(currentTokenId);
        if (alreadyOwnerId == _tokenId.toString()) {
          setAlreadyOwnerId(alreadyOwnerId);
          let ipfs = await contract!.tokenURI(+alreadyOwnerId);

          let url = ipfs.replace("ipfs://", "");

          let res = await axios.get(`https://nftstorage.link/ipfs/${url}`);

          const persons = res.data;
          setImageName(persons.name);
          setImageUrl(persons.image.replace("ipfs://", ""));
        }
      });

      setContract(contract);
      setConnected(true);

      const currentTokenId = (await contract.tokenIds()).toString();
      setTokenId(currentTokenId);

      const alreadyOwnerId = (
        await contract.tokenIdByUser(gelatoSmartWallet.getAddress())
      ).toString();

      setAlreadyOwnerId(alreadyOwnerId);
      setTokenId(currentTokenId);

      if (alreadyOwnerId != "0") {
        let ipfs = await contract.tokenURI(+alreadyOwnerId);

        let url = ipfs.replace("ipfs://", "");

        let res = await axios.get(`https://nftstorage.link/ipfs/${url}`);

        const persons = res.data;

        setImageName(persons.name);
        setImageUrl(persons.image.replace("ipfs://", ""));
      }

      const interval = setInterval(fetchStatus, 5000);
      setIsLoading(false);
      return () => clearInterval(interval);
    };
    init();
  }, [web3AuthProvider]);

  useTitle("Gelato ETH Dubai Gasless Minting");

  return (
    <div className="App bg-slate-600 h-screen flex flex-col content-center">
      <NavBar />
      <div className="flex justify-center">
        {isExploding && <ConfettiExplosion {...largeProps} />}
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
        selectTime={selectTime}
      />
    </div>
  );
}

export default App;
