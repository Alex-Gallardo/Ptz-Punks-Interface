import { useWeb3React } from "@web3-react/core";
import PunkCard from "../../components/punk-card";
import Loading from "../../components/loading";
import RequestAccess from "../../components/request-access";
import { usePlatziPunksData } from "../../hooks/usePlatziPunksData";
import { Grid, Heading, Text, InputGroup, InputLeftElement, Input, InputRightElement, Button, FormHelperText, FormControl } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Punks = () => {
	const [address, setAddress] = useState(new URLSearchParams(useLocation().search).get("address") || "");
	const [submitted, setsSubmitted] = useState(true);
	const [validAddress, setsValidAddress] = useState(true);
	const { active, library } = useWeb3React();
	const { punks, loading } = usePlatziPunksData({ owner: submitted && validAddress ? address : null });
	const navigate = useNavigate();

	const handleAddressChange = ({ target: { value } }: any) => {
		setAddress(value);
		setsSubmitted(false);
		setsValidAddress(false);
	};

	const submit = (e: any) => {
		e.preventDefault();
		if (address) {
			const isValid = library.utils.isAddress(address);
			setsValidAddress(isValid);
			setsSubmitted(true);
			if (isValid) {
				navigate(`/punks?address=${address}`);
			}
		} else {
			navigate("/punks");
		}
	};

	if (!active) return <RequestAccess />;

	return (
		<div>
			<form onSubmit={submit}>
				<FormControl>
					<InputGroup mb="3">
						<InputLeftElement pointerEvents={"none"} children={<Search2Icon color="gray.300" />}></InputLeftElement>
						<Input placeholder="Buscar por direccion" isInvalid={false} value={address} onChange={handleAddressChange} />
						<InputRightElement width="5.5rem">
							<Button variant="outline" type="submit" h="1.75rem" size="sm">
								Buscar
							</Button>
						</InputRightElement>
					</InputGroup>
					{submitted && !validAddress && <FormHelperText color="red.500">Direccion invalida</FormHelperText>}
				</FormControl>
			</form>
			{loading ? (
				<Loading />
			) : (
				<>
					<Heading lineHeight={1.1} fontWeight={600} fontSize={{ base: "6xl", sm: "4xl", lg: "6xl" }} margin={"0.5em 0 1em 0"}>
						<Text
							as={"span"}
							position={"relative"}
							_after={{
								content: "''",
								width: "full",
								height: "30%",
								position: "absolute",
								bottom: 1,
								left: 0,
								bg: "green.400",
								zIndex: -1
							}}
							style={{ marginRight: "0.3em" }}
						>
							Platzi Punks
						</Text>
						<Text as={"span"} color={"green.400"}>
							generados
						</Text>
					</Heading>
					<Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr)) " gap={6}>
						{punks.map((punk: any) => (
							<Link key={punk.tokenId} to={`/punks/${punk.tokenId}`}>
								<PunkCard image={punk.image} name={punk.name} />
							</Link>
						))}
					</Grid>
				</>
			)}
		</div>
	);
};

export default Punks;
