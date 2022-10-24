import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import usePlatziPunks from "../usePlatziPunks/index";

const getPunkData = async ({ platziPunks, tokenId }: any) => {
	const [
		tokenURI,
		dna,
		owner,
		accessoriesType,
		clotheColor,
		clotheType,
		eyeType,
		eyeBrowType,
		facialHairColor,
		facialHairType,
		hairColor,
		hatColor,
		graphicType,
		mouthType,
		skinColor,
		topType
	] = await Promise.all([
		platziPunks.methods.tokenURI(tokenId).call(),
		platziPunks.methods.tokenDNA(tokenId).call(),
		platziPunks.methods.ownerOf(tokenId).call(),
		platziPunks.methods.getAccessoriesType(tokenId).call(),
		platziPunks.methods.getAccessoriesType(tokenId).call(),
		platziPunks.methods.getClotheColor(tokenId).call(),
		platziPunks.methods.getClotheType(tokenId).call(),
		platziPunks.methods.getEyeType(tokenId).call(),
		platziPunks.methods.getEyeBrowType(tokenId).call(),
		platziPunks.methods.getFacialHairColor(tokenId).call(),
		platziPunks.methods.getFacialHairType(tokenId).call(),
		platziPunks.methods.getHairColor(tokenId).call(),
		platziPunks.methods.getHatColor(tokenId).call(),
		platziPunks.methods.getGraphicType(tokenId).call(),
		platziPunks.methods.getMouthType(tokenId).call(),
		platziPunks.methods.getSkinColor(tokenId).call(),
		platziPunks.methods.getTopType(tokenId).call()
	]);

	const responseMedatada = await fetch(tokenURI);
	const metadata = await responseMedatada.json();

	return {
		tokenId,
		attributes: {
			accessoriesType,
			clotheColor,
			clotheType,
			eyeType,
			eyeBrowType,
			facialHairColor,
			facialHairType,
			hairColor,
			hatColor,
			graphicType,
			mouthType,
			skinColor,
			topType
		},
		tokenURI,
		dna,
		owner,
		...metadata
	};
};

const usePlatziPunksData = ({ owner = null }: any = {}) => {
	const [punks, setPunks]: any[] = useState([]);
	const { library } = useWeb3React();
	const [loading, setLoading] = useState(true);
	const platziPunks = usePlatziPunks();

	// useCallback(): Ya que se usara dentro de un useEffect, se usa para no volver a ejecutar el código si no se cambia el valor de la variable.
	const update = useCallback(async () => {
		// Evitar error de desconexión de la conexión con la wallet.
		if (!platziPunks) return;
		setLoading(true);
		// Se va a buscar de uno en uno en la blockchain.
		let tokenIds;

		// Si la direccion es valida
		if (!library.utils.isAddress(owner)) {
			const totalSupply = await platziPunks.methods.totalSupply().call();
			tokenIds = new Array(Number(totalSupply)).fill(0).map((_, index) => index);
		} else {
			const balanceOf = await platziPunks.methods.balanceOf(owner).call();
			// Mapear la lista de tokens, que le pertenecen a esta direccion
			const tokenIdsOfOwner = new Array(Number(balanceOf)).fill(0).map((_, index) => platziPunks.methods.tokenOfOwnerByIndex(owner, index).call());
			tokenIds = await Promise.all(tokenIdsOfOwner);
		}

		const punksPromise = tokenIds.map(async (tokenId) => getPunkData({ tokenId, platziPunks }));
		const punks = await Promise.all(punksPromise);
		setPunks(punks);
		setLoading(false);
	}, [platziPunks, owner, library?.utils]);

	useEffect(() => {
		update();
	}, [update]);

	return {
		loading,
		punks,
		update
	};
};

const usePlatziPunkData = (tokenId: any) => {
	const [punk, setPunk]: any[] = useState([]);
	const [loading, setLoading] = useState(true);
	const platziPunks = usePlatziPunks();

	const update = useCallback(async () => {
		// Evitar error de desconexión de la conexión con la wallet.
		if (!platziPunks && tokenId == null) return;
		setLoading(true);
		// Se va a buscar de uno en uno en la blockchain.
		const punkResult = await getPunkData({ tokenId, platziPunks });
		setPunk(punkResult);

		setLoading(false);
	}, [platziPunks, tokenId]);

	useEffect(() => {
		update();
	}, [update]);

	return {
		loading,
		punk,
		update
	};
};

export { usePlatziPunksData, usePlatziPunkData };
