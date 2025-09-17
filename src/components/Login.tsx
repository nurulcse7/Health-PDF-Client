// src/pages/Login.tsx
import { useState } from "react";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validation
		const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
		if (!email.match(emailPattern)) {
			alert("Please enter a valid email!");
			return;
		}
		if (password.length < 6) {
			alert("Password must be at least 6 characters!");
			return;
		}

		setLoading(true);

		try {
			const res = await fetch("http://localhost:5000/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			if (data.success) {
				localStorage.setItem("token", data.token);
				localStorage.setItem("user", JSON.stringify(data.user));
				alert(`Login successful! Welcome, ${data.user.fullname}`);
				setEmail("");
				setPassword("");
				// Redirect
				window.location.href = "/";
			} else {
				alert(`Login failed: ${data.message}`);
			}
		} catch (err) {
			console.error(err);
			alert("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="h-screen flex justify-center items-center bg-gradient-to-br from-[#ee7752] via-[#e73c7e] to-[#23a6d5] animate-gradientBG">
			<div className="login-box bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-lg w-[350px] text-center animate-floatUp">
				<h2 className="text-white font-bold text-2xl mb-6">Welcome Back</h2>
				<form onSubmit={handleSubmit}>
					<div className="input-box mb-5">
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
							className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 focus:bg-white/30 focus:shadow-md outline-none transition"
						/>
					</div>
					<div className="input-box mb-5">
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
							className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 focus:bg-white/30 focus:shadow-md outline-none transition"
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className={`w-full py-3 rounded-xl font-semibold text-gray-800 bg-white hover:bg-gray-100 transition ${
							loading ? "cursor-not-allowed opacity-60" : ""
						}`}>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
				<div className="links mt-4 text-white">
					<a
						href="/signup"
						className="text-sm hover:text-yellow-400 transition">
						Sign Up
					</a>
				</div>
			</div>

			{/* Tailwind Animations */}
			<style>{`
				@keyframes gradientBG {
					0% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}
				.animate-gradientBG {
					background-size: 400% 400%;
					animation: gradientBG 15s ease infinite;
				}
				@keyframes floatUp {
					from { opacity: 0; transform: translateY(40px); }
					to { opacity: 1; transform: translateY(0); }
				}
				.animate-floatUp {
					animation: floatUp 1.2s ease;
				}
			`}</style>
		</div>
	);
}
