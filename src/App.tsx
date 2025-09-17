// src/App.tsx
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import PdfPage from "./components/PdfPage";
import Login from "./components/Login";
import SignUp from "./components/signup";

function App() {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<any>(null);

	// Load user and token from localStorage
	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		const storedUser = localStorage.getItem("user");
		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setToken(null);
		setUser(null);
	};

	return (
		<div className="min-h-screen  bg-gradient-to-r from-purple-100 via-pink-50 to-blue-50 text-gray-800">
			{/* Navbar */}
			<header className="pt-[30px]">
				<nav className="bg-white max-w-4xl   mx-auto shadow-lg p-4 flex justify-between items-center rounded-xl">
					<div className="flex gap-6 items-center">
						<Link
							to="/"
							className="text-purple-600 font-semibold hover:text-purple-800 transition">
							Home
						</Link>
						{token && (
							<Link
								to="/pdf/123"
								className="text-pink-500 font-semibold hover:text-pink-700 transition">
								Sample PDF
							</Link>
						)}
					</div>

					<div className="flex gap-4 items-center">
						{token && user ? (
							<>
								<span className="text-gray-700 font-medium">
									Hello, {user.fullname}
								</span>
								<button
									onClick={handleLogout}
									className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition">
									Logout
								</button>
							</>
						) : (
							<>
								<Link
									to="/login"
									className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-lg shadow hover:from-purple-500 hover:to-pink-600 transition">
									Login
								</Link>
								<Link
									to="/signup"
									className="bg-gradient-to-r from-blue-400 to-teal-400 text-white px-4 py-2 rounded-lg shadow hover:from-blue-500 hover:to-teal-500 transition">
									Signup
								</Link>
							</>
						)}
					</div>
				</nav>
			</header>

			{/* Main Content */}
			<div className="p-6 ">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route
						path="/login"
						element={token ? <Navigate to="/" /> : <Login />}
					/>
					<Route
						path="/signup"
						element={token ? <Navigate to="/" /> : <SignUp />}
					/>
					<Route path="/pdf/:id" element={<PdfPage />} />
				</Routes>
			</div>
		</div>
	);
}

export default App;
