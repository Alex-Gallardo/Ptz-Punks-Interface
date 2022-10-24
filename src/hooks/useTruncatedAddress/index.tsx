import { useMemo } from "react";

const useTruncatedAddress = (account: any) => {
	const truncated = useMemo(() => `${account?.substr(0, 6)}...${account?.substr(-4)}`, [account]);

	return truncated;
};

export default useTruncatedAddress;
