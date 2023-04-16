import "./App.css";
import Web3 from "web3";
import React, { useState, useEffect } from "react";
import demo from "./contracts/demo.json";

function App() {
  const [state, setState] = useState({ web3: null, contract: null });
  const [data, setData] = useState("");

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    async function template() {
      const web3 = new Web3(provider);
      // console.log(web3); // we have many methods ex: eth, utils

      // To get contract address
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = demo.networks[networkId];
      // console.log(deployedNetwork.address)

      // contract Instance
      const contract = new web3.eth.Contract(demo.abi, deployedNetwork.address);

      setState({ web3: web3, contract: contract });
    }
    provider && template();
  }, []);

  useEffect(() => {
    const { contract } = state;
    async function readData() {
      const data = await contract.methods.getX().call();
      setData(data);
    }
    contract && readData();
  }, [state]);

  async function writeData() {
    const { contract } = state;
    const data = document.querySelector("#value").value;
    await contract.methods
      .setX(data)
      .send({ from: "0xaA97349519BDf8495070dF59A00CD97A9446A617" });
    window.location.reload();
  }

  return (
    <div className="App">
      <p>Contract Data : {data}</p>
      <input type="text" id="value" />
      <button onClick={writeData}>setData</button>
    </div>
  );
}

export default App;