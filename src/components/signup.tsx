// src/pages/SignUp.tsx
import { useState } from "react";

export default function SignUp() {
	const [fullname, setFullname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match!");
			return;
		}

		const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
		if (!email.match(emailPattern)) {
			alert("Please enter a valid email!");
			return;
		}

		setLoading(true);

		try {
			const res = await fetch("http://localhost:5000/api/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullname, email, password }),
			});

			const data = await res.json();

			if (data.success) {
				alert("Account created successfully!");
				setFullname("");
				setEmail("");
				setPassword("");
				setConfirmPassword("");
				// Redirect to login
				window.location.href = "/login";
			} else {
				alert(`Signup failed: ${data.message}`);
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
			<div className="signup-box bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-lg w-[380px] text-center animate-floatUp">
				<h2 className="text-white font-bold text-2xl mb-6">Create Account</h2>
				<form onSubmit={handleSubmit}>
					<div className="input-box mb-5">
						<input
							type="text"
							placeholder="Full Name"
							value={fullname}
							onChange={e => setFullname(e.target.value)}
							required
							className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 focus:bg-white/30 focus:shadow-md outline-none transition"
						/>
					</div>
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
					<div className="input-box mb-5">
						<input
							type="password"
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}
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
						{loading ? "Signing up..." : "Sign Up"}
					</button>
				</form>
				<div className="links mt-4 text-white">
					<a href="/login" className="text-sm hover:text-yellow-400 transition">
						Already have an account? Login
					</a>
				</div>
			</div>

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
