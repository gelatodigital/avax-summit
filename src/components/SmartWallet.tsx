import { BlockExplorerDataType, getBlockExplorerUrl } from "../utils";

export const SmartWallet: React.FC<{
  address: string;
  isDeployed: boolean;
  chainId: number;
}> = (props) => {
  console.log(props);
  return (
    <div className="flex flex-col gap-1 my-5 px-4 py-5 border-neutral-100 rounded-lg shadow-md">
      <div className="flex flex-col gap-3 justify-center items-center">
        <p className="text-xl  text-white">
          Smart Wallet Address 
        </p>
        <a
          href={`${getBlockExplorerUrl(
            props.chainId,
            props.address,
            BlockExplorerDataType.Address
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-md text-white">{props.address}</p>
        </a>
        <p className="text-sm text-[#f5c3a6]">
          {props.isDeployed ? "Deployed" : "Not Deployed Yet"}
        </p>
      </div>
    </div>
  );
};
