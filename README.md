![DESMO-LD](https://github.com/vaimee/desmo/blob/c763cec12f6c9060a9f1a3335ff4cff60ece3df2/imgs/desmo-logo.png)
# DESMO-LD Contracts

**Overview** 

The Desmo-LD iExecDOracle is a Smart contract that implements the IExec INTERFACE_NAME. Its purpose is to serve as the main API entrypoint for client Smart Contracts. Additionally, to the IExec API, the DESMO-LD iExecDOracle will implement the logic to randomly select a set of valid Thing Description Directories registered in the DESMO-LD Hub. The APIs will serve on-chain clients with endpoints that can search for a device inside the DESMO-LD network of Thing Description Directories, get sensor data, invoke operations on remote sensors and finally subscribe to events.

## Description

This is a simple smart contract that can store and retireve assets on the viviani chain (iExec Sidechin Testenet)

### Deployment

To deploy this smart contract on viviani chain:

1. Install the MetaMask Browser Wallet: [https://metamask](https://metamask.io/)
2.  Configure it and go to settings > advanced > "Show test networks". Enable it.
3. Contact iExec team to include your address on their white list
4.  Go to Remix IDE: [https://remix.ethereum.org/](https://remix.ethereum.org/)
5. Copy your smart contract code here or connect to the repository or your local environment
6. Move into the "Solidity compiler" section and hit the "Compile" button
7. Move into the "Deploy & run transactions" section and select "Injected Web3" as ENVIRONMENT
8. Select your MetaMask account that you want to use (The one included on iExec whitelist)
9. Select the correct compiled contract that you want to deploy
10. Hit the "Deploy" button and sign the transaction with MetaMask (everything will be automatic)


