import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import PlatziPunksArtifact from "../../config/web3/artifacts/PlatziPunks";

const { address, abi } = PlatziPunksArtifact;

const usePlatziPunks = () => {
	// Estado de la aplicacion
	const { active, library, chainId } = useWeb3React();

	// Instancia del contrato
	const platziPuks = useMemo(() => {
		if (active) return new library.eth.Contract(abi, address[chainId as number]);
		else return undefined;
	}, [active, chainId, library?.eth?.Contract]);

	return platziPuks;
};

export default usePlatziPunks;
