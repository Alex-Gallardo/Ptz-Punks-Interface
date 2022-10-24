import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/main";
import Home from "./views/home";
import Punks from "./views/punks";
import Punk from "./views/punk";

function App() {
	return (
		<BrowserRouter>
			<MainLayout>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/punks" element={<Punks />} />
					<Route path="/punks/:tokenId" element={<Punk />} />
				</Routes>
			</MainLayout>
		</BrowserRouter>
	);
}

export default App;
