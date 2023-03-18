import { UserInfo } from "@web3auth/base";
import { Eoa } from "../Eoa";
import { Tasks } from "../Tasks";
import { useAppSelector } from "../../store/hooks";
import { GaslessWalletInterface } from "@gelatonetwork/gasless-onboarding";
import { Loading } from "../Loading";
import ReCAPTCHA from "react-google-recaptcha";
import { Dropdown } from "react-dropdown-now";
import "react-dropdown-now/style.css";

interface PlaceHolderProps {
  connected: boolean;
  user: Partial<UserInfo> | null;
  wallet: { address: string; chainId: number } | null;
  smartWallet: GaslessWalletInterface | null;
  isDeployed: boolean;
  tokenId: string;
  ownerOf: string;
  isLoading: boolean;
  imageUrl: string;
  imageName: string;
  toggleConnect: () => {};
  mint: () => {};
  captcha: (token: any) => {};
  selectTime: (val: any) => {};
}

const largeProps = {
  force: 0.6,
  duration: 5000,
  particleCount: 200,
  height: 1600,
  width: 1600,
};

const PlaceHolderApp = (props: PlaceHolderProps) => {
  const tasks = useAppSelector((state) => state.tasks.tasks);

  return (
    <div>
      <div className="flex flex-row  justify-content-center align-items-center mt-2 mr-4 ml-4">
        <div className="card  bg-base-100 grow shadow-xl basis-1/5">
          <div
            style={{ alignItems: "center" }}
            className="card-body justify-content-center align-items-center"
          >
            <div className="flex flex-col justify-content-center align-items-center">
              <h2 className="text-2xl underline underline-offset-4 font-semibold text-white">
                {" "}
                Gelato EthDubai Gasless Minting
              </h2>
            </div>
            {props.isLoading ? (
              <Loading />
            ) : (
              <div>
                {!props.connected && (
                  <div>
                    <div className="App">
                      <ReCAPTCHA
                        sitekey="6LdnyQslAAAAAIeyqe6cAATmUSgWDqPBqNGiQE9I"
                        onChange={(token) => props.captcha(token)}
                      />
                    </div>
                    <button
                      style={{ borderColor: "unset", color: "black" }}
                      className="btn btn-primary mt-4 bg-gradient-to-r from-[#b45f63] to-[#f5c3a6] border-neutral-100 border-color"
                      onClick={() => props.toggleConnect()}
                    >
                      Sign in
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {props.connected ? (
            <div className="pt-1 flex-col justify-content-center align-items-center">
              <Eoa
                user={props.user}
                wallet={props.wallet}
                smartAddress={props.smartWallet?.getAddress()!}
                isDeployed={props.isDeployed}
              />

              <div className="mb-4 flex-column self-center">
                <h2 className="text-xl underline-offset-4  text-white">
                  Total NFTs minted: {props.tokenId}
                </h2>
                {props.ownerOf == "0" ? (
                  <div>
                    <p>Do you want your NFT by nightime or daylight</p>

                    <div style={{ width: "200px", margin: "25px auto 10px" }}>
                      <Dropdown
                        placeholder="Select an option"
                        options={["By Day", "By Night"]}
                        value="By Night"
                        onSelect={(value) => props.selectTime(value)}
                      />
                    </div>

                    {/* <button
                      style={{
                        borderColor: "unset",
                        color: "black",
                        width: "200px",
                      }}
                      className="btn btn-primary mt-4 bg-gradient-to-r from-[#b45f63] to-[#f5c3a6] border-neutral-100"
                      onClick={() => props.mint()}
                    >
                      Mint
                    </button> */}
                    <p>Minting Period Finished</p>
                  </div>
                ) : (
                  <div className="mt-2">
                    <h3> Your Token : {props.imageName}</h3>
                    {props.imageUrl == "" ? (
                      <p></p>
                    ) : (
                      <img
                        width={250}
                        height={250}
                        style={{ margin: " 20px auto" }}
                        src={`https://ipfs.io/ipfs/${props.imageUrl}`}
                      />
                    )}
                    <div></div>
                    <div>
                      <a
                        href={`https://opensea.io/assets/matic/0xD47c74228038E8542A38e3E7fb1f4a44121eE14E/${props.ownerOf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <p className="text-md text-white">
                          <span
                            style={{ color: "#f5c3a6", marginRight: "5px" }}
                            className="underline"
                          >
                            View
                          </span>{" "}
                          your NFT on OpenSea
                        </p>
                      </a>
                    </div>
                    <div>
                      <a
                        href={`https://beta.app.gelato.network/task/0x0ac1d185cefa75b0852ca52973630be6c2d4f49abf6585f18862ccc384c65a62?chainId=137`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <p className="text-md text-white">
                          <span
                            style={{ color: "#f5c3a6", marginRight: "5px" }}
                            className="underline "
                          >
                            {" "}
                            Explore
                          </span>{" "}
                          this Web3 Function
                        </p>
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div>
                {props.connected && (
                  <button
                    style={{
                      marginBottom: "20px",
                      borderColor: "unset",
                      color: "black",
                      background: "grey",
                    }}
                    className="btn btn-primary mt-4  border-neutral-100 border-color"
                    onClick={() => props.toggleConnect()}
                  >
                    Sign Out
                  </button>
                )}
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
