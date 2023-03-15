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
                <p className="text-md text-white font-medium">Logged in with:  </p>
                <p className="text-md text-white font-medium">{user?.email}</p>
              </div>
              <div className="flex flex-row justify-center">
                <p className="text-md  text-white font-medium">
                  Address: {wallet?.address}, Chain Id: {wallet?.chainId}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
            <div className="flex mt-2 flex-row justify-center">
        <p className="text-md  text-base font-medium">
          {" "}
          Smart Wallet Address:   
        </p>
        <a
          href={`https://polygonscan.com/address/${props.smartAddress}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-md text-base">{props.smartAddress}</p>
        </a>
     
       
      </div>
      <p className="text-md text-base"> {props.isDeployed ? "is Deployed" : "Not Deployed Yet"}</p>
    </div>
  );
};
