# Gelato Gasless Wallet Demo App using Hardhat & React

This demo should help devs create web3 apps implementing Gelato Gasless Wallet rapidly, providing a hardhat instance, a basic react UI and the required infrastructure to get up and running.

This repo consists of a hardhat folder with a contract called GelatoWalletNft.sol as well as a minimal frontend written in React.

The contract is a ERC721 contract with the public method mint.

The contract is deployeed on mumbai [here](https://mumbai.polygonscan.com/address/0x67c982310a687e43ba2a659b1117f6c5b73bb662) 


The demo app is line under: [https://web3-functions-demo.gelato.network/](https://web3-functions-demo.gelato.network/)


&nbsp;

# 🏄‍♂️ Dev Quick Start


Add the env keys required

```bash
RPC=YOUR_PROVIDER_URL
PK=YOUR PRIVATE KEY
MUMBAI_API_KEY=YOUR ETHERSCAN/POLYGON KEY
```

Change the values in .env-example file and rename it to .env
&nbsp;

## Contract Deployment


### 1) : We compile our contract

```javascript
npm run compile
```

### 2) : We deploy our contract

```javascript
npm run contract:deploy
```


## React Frontend
In a separate temrminal run following command

### Known Issues
When using web3Auth there are some known isses with Webpack 5, if you start your project from zero, please follow this [guide](https://web3auth.io/docs/troubleshooting/webpack-issues) to create the required polyfills

```javascript
npm run start
```
