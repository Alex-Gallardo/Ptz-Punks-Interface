// Clase
import { InjectedConnector } from "@web3-react/injected-connector";
// @ts-ignore
import Web3 from "web3/dist/web3.min";

// Sugerencia
// import { InjectedConnector } from "web3-react/dist/connectors";
// const connector = new InjectedConnector({ supportedNetworks: [4] });

const connector = new InjectedConnector({
	supportedChainIds: [
		4, // Rinkeby
		5 // Goerli
	]
});

const getLibrary = (provider: any) => {
	const library = new Web3(provider);
	return library;
};

export { connector, getLibrary };
