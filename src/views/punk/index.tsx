import { useState } from "react";
import { useParams } from "react-router-dom";
import { Stack, Heading, Text, Table, Thead, Tr, Th, Td, Tbody, Button, Tag, useToast } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { usePlatziPunkData } from "../../hooks/usePlatziPunksData";
import RequestAccess from "../../components/request-access";
import PunkCard from "../../components/punk-card";
import Loading from "../../components/loading";
import usePlatziPunks from "../../hooks/usePlatziPunks";

const Punk = () => {
	const { active, account, library } = useWeb3React();
	const { tokenId } = useParams();
	const { loading, punk, update }: any = usePlatziPunkData(tokenId);
	const [tranfering, setTransfering] = useState(false);
	const platziPunks = usePlatziPunks();
	// Mostrar mensajes
	const toast = useToast();

	if (!active) return <RequestAccess />;
	if (loading) return <Loading />;

	const transferPunk = () => {
		setTransfering(true);

		const address = prompt("Ingrese la dirección del destinatario");
		const isAddress = library.utils.isAddress(address);

		if (isAddress) {
			// Transferir
			platziPunks.methods
				.safeTransferFrom(punk.owner, address, punk.tokenId)
				.send({ from: account })
				.on("transactionHash", (hash: string) => {
					toast({
						title: "Transacción enviada",
						description: hash,
						status: "info",
						duration: 9000,
						isClosable: true
					});
				})
				.on("receipt", (receipt: any) => {
					setTransfering(false);
					toast({
						title: "Punk transferido",
						description: "El punk ha sido transferido correctamente",
						status: "success",
						duration: 9000,
						isClosable: true
					});
					update();
				})
				.on("error", (error: any) => {
					setTransfering(false);
					toast({
						title: "Error al transferir",
						description: error.message,
						status: "error",
						duration: 9000,
						isClosable: true
					});
				});
		} else {
			toast({
				title: "Error",
				description: "La dirección no es válida",
				status: "error",
				duration: 5000,
				isClosable: true
			});
			setTransfering(false);
		}
	};

	return (
		<Stack spacing={{ base: 8, md: 10 }} py={{ base: 5 }} direction={{ base: "column", md: "row" }}>
			<Stack>
				<PunkCard
					mx={{
						base: "auto",
						md: 0
					}}
					name={punk.name}
					image={punk.image}
				/>
				<Button onClick={transferPunk} disabled={account !== punk.owner} colorScheme={account !== punk.owner ? "red" : "green"} isLoading={tranfering}>
					{account !== punk.owner ? "No eres el dueño" : "Transferir"}
				</Button>
			</Stack>
			<Stack width="100%" spacing={5}>
				<Heading>{punk.name}</Heading>
				<Text fontSize="xl">{punk.description}</Text>
				<Text fontWeight={600}>
					ADN:
					<Tag ml={2} colorScheme="green">
						{punk.dna}
					</Tag>
				</Text>
				<Text fontWeight={600}>
					Owner:
					<Tag ml={2} colorScheme="green">
						{punk.owner}
					</Tag>
				</Text>
				<Table size="sm" variant="simple">
					<Thead>
						<Tr>
							<Th>Atributo</Th>
							<Th>Valor</Th>
						</Tr>
					</Thead>
					<Tbody>
						{Object.entries(punk.attributes).map(([key, value]: any) => (
							<Tr key={key}>
								<Td>{key}</Td>
								<Td>
									<Tag>{value}</Tag>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</Stack>
		</Stack>
	);
};

export default Punk;
