import { Flex, Button, Tag, TagLabel, Badge, TagCloseButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { connector } from "../../../config/web3";
import { useCallback, useEffect, useState } from "react";
// @ts-ignore
import useTruncatedAddress from "../../../hooks/useTruncatedAddress";

const WalletData = () => {
	const [balance, setBalance] = useState(0);
	// Hook de web3 que nos permite manejar la cartera y sus actividades
	const { active, activate, deactivate, account, error, library } = useWeb3React();

	// Red no soportada
	const isUnsupportedChain = error instanceof UnsupportedChainIdError;

	// Funcion que se ejecuta cuando se activa la cartera
	const connect = useCallback(() => {
		activate(connector);
		// Guardamos la conexion en el localStorage
		localStorage.setItem("previouslyConnected", "true");
	}, [activate]);

	// Funcion que se ejecuta cuando se desactiva la cartera
	const disconnect = () => {
		deactivate();
		localStorage.removeItem("previouslyConnected");
	};

	useEffect(() => {
		// Verificamos si la cartera ha sido conectada previamente
		if (localStorage.getItem("previouslyConnected") === "true") connect();
	}, [connect]);

	const getBalance = useCallback(async () => {
		const toSet = await library.eth.getBalance(account);
		const bal: number = toSet / 1e18;
		setBalance(Number(bal.toFixed(2)));
	}, [library?.eth, account]);

	useEffect(() => {
		// Si esta activa la cartera, obtenemos el balance
		if (active) getBalance();
	}, [active, getBalance]);

	const truncatedAddress = useTruncatedAddress(account);

	const dBadge: any = {
		base: "none",
		md: "block"
	};

	return (
		<Flex alignItems={"center"}>
			{active ? (
				<Tag colorScheme="green" borderRadius="full">
					<TagLabel>
						<Link to={`/punks?address=${account}`}>{truncatedAddress}</Link>
					</TagLabel>
					<Badge display={dBadge} variant="solid" fontSize="0.8rem" ml={1}>
						~{balance} Ξ
					</Badge>
					<TagCloseButton onClick={disconnect} />
				</Tag>
			) : (
				<Button variant={"solid"} colorScheme={"green"} size={"sm"} leftIcon={<AddIcon />} onClick={connect} disabled={isUnsupportedChain}>
					{isUnsupportedChain ? "Red no soportada" : "Conectar wallet"}
				</Button>
			)}
		</Flex>
	);
};

export default WalletData;
