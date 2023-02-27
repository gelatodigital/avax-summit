import { useState } from "react";

import { } from '../../App'
interface PlaceHolderProps {
  connected: boolean;
  toggleActive: ()=> {}
}



const PlaceHolderApp = (props: PlaceHolderProps) => {
  return (
    <div>
      <div className="flex flex-row  mt-5 mr-8 ml-8">
        <div className="card  bg-base-100 grow shadow-xl basis-1/5">
          <div style={{alignItems:'center'}} className="card-body justify-content-center align-items-center">
            <div className="flex flex-col justify-content-center align-items-center">
              <h2 className="card-title mb-2">
                Gelato Wallet Gasless Minting
              </h2>
              <div className="mb-4  self-center">
               Token Nr
             
                <p style={{height:'30px', background: props.connected ? 'green' :'red', width:'30px', borderRadius:'20px', margin:'auto'}}></p>
            
                <button
                  className="btn btn-primary mt-4"
                  onClick={() => props.toggleActive()}
                >
                  {" "}
                  {props.connected ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="card-title">{props.connected}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceHolderApp;
