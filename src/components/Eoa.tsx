import { UserInfo } from "@web3auth/base";
export const Eoa: React.FC<{
  user: Partial<UserInfo> | null;
  wallet: { address: string; chainId: number } | null;
  smartAddress: string;
  isDeployed: boolean;
  chainId: number;
}> = (props) => {
  const { user, wallet } = props;

  return (
    <div className="flex flex-col  bg-opacity-30 mb-2">
      {user && (
        <div className="flex flex-column justify-center">
          {user.email && (
            <div>
              <div className="flex flex-row  justify-center">
                <p className="text-md mt-1 text-white font-medium">
                  Logged in with:{" "}
                </p>
                <p className="text-md mt-1 text-white font-medium">
                  {user?.email}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex mt-2 flex-col justify-center">
        <p className="text-md mb-1 text-base  font-medium">
          <span className="text-white"> Wallet: </span> {wallet?.address}
        </p>
        <p className="text-md  text-base font-medium">
          <span className="text-white">Smart Wallet: </span>
          <a
            href={`https://polygonscan.com/address/${props.smartAddress}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            <span style={{ color: "#f5c3a6" }} className="underline ">
              {" "}
              {props.smartAddress}
            </span>
          </a>
        </p>
      </div>
      <p className="text-md text-base">
        {" "}
        {props.isDeployed ? "is Deployed" : "Not Deployed Yet"}
      </p>
    </div>
  );
};
