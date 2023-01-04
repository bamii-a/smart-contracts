// imports
import { ethers } from "./ethers-5.5.esm.min.js";
import { abi, contractAddress } from "./constants.js";

// get elements
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const withdrawButton = document.getElementById("withdrawButton");
const balanceButton = document.getElementById("balanceButton");
const ethAmountInput = document.getElementById("ethAmount");

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    console.log("ethereum", ethereum);
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    console.log("connected");
    connectButton.innerHTML = "connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    connectButton.innerHTML = "please install metamask";
  }
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    /* Creating a provider object that is connected to the blockchain. */
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    /* Getting the signer from the provider. */
    const signer = provider.getSigner();
    /* Creating a contract object that is connected to the blockchain. */
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      /* Calling the withdraw function on the contract. */
      const txResponse = await contract.withdraw();
      /* Waiting for the transaction to be mined. */
      await listenForTxMine(txResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}

async function getBalance() {
  // reading from the blockchain
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function fund() {
  const ethAmount = ethAmountInput.value;
  console.log(`funding with ${ethAmount}`);
  if (typeof window.ethereum !== "undefined") {
    // to send a transaction we need
    // provider / connection to the blockchain
    // signer / wallet
    // get contract with ABI & address
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // console.log(provider);
    // await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log(`signer: ${signer}`);
    // get contract by getting the ABI and address
    const contract = new ethers.Contract(contractAddress, abi, signer);
    console.log("contract", contract);
    console.log("contract.fund", contract.fund);
    try {
      const txResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      // wait for tx to finish
      await listenForTxMine(txResponse, provider);
      console.log("Done");
    } catch (error) {
      console.log(error);
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask";
  }
}

// listening to the blockchain for tx to be mined
function listenForTxMine(txResponse, provider) {
  console.log(`mining...${txResponse.hash}`);
  // create a listener for the blockchain
  // listen for tx to finish

  return new Promise((resolve, reject) => {
    function listenerFunc(txReciept) {
      console.log(`completed with ${txReciept.confirmations} confirmations`);
      resolve();
    }
    provider.once(txResponse.hash, listenerFunc);
  });
}
