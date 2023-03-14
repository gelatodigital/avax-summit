import { UserInfo } from "@web3auth/base";
export const Eoa: React.FC<{
  user: Partial<UserInfo> | null;
  wallet: { address: string; chainId: number } | null;
}> = (props) => {
  const { user, wallet } = props;
console.log(props)
  return (
    <div className="flex flex-col gap-3  bg-opacity-30 rounded-lg shadow-md pb-4">
      {user && (
        <div className="flex flex-column gap-1 justify-center">
    
          {user.email && (
            <div className="flex flex-row gap-1">
              <p className="text-base font-medium">Logged in with</p>
              <p className="text-base font-bold">{user?.email}</p>
            </div>
          )}
        </div>
      )}
      <div>
        <div className="flex flex-row gap-1 justify-center">
          <p className="text-lg font-medium">Address: {wallet?.address}</p>
       
        </div>
        <div className="flex flex-row gap-1 justify-center">
          <p className="text-lg font-medium">Chain Id: {wallet?.chainId}</p>
        </div>
      </div>
    </div>
  );
};
