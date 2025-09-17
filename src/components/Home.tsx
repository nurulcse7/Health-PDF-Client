import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent, FormEvent } from "react";

const Home = () => {
	const navigate = useNavigate();
	const [photoPreview, setPhotoPreview] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<any>({
		civilId: "297123003383",
		nameAr: "سوجون امريز علي",
		nationalityAr: "بنغلاديشي",
		categoryAr: "متداولي الاغذية",
		jobAr: "عامل تنظيف مكاتب",
		companyAr: "شركه جي ام للمقاولات العامه",
		issueDate: "2023-09-14",
		endDate: "2024-09-13",
	});

	const token = localStorage.getItem("token");

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData({ ...formData, photo: file });
			const reader = new FileReader();
			reader.onload = event => {
				setPhotoPreview(event.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!token) {
			alert("You must login first!");
			return navigate("/login");
		}
		setLoading(true);
		const data = new FormData();
		Object.keys(formData).forEach(key => {
			if (formData[key]) data.append(key, formData[key]);
		});

		try {
			const response = await fetch("http://localhost:5000/api/certificate", {
				method: "POST",
				body: data,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 401) {
				alert("Session expired. Please login again!");
				localStorage.removeItem("token");
				return navigate("/login");
			}

			const result = await response.json();

			if (result.success) {
				navigate(`/pdf/${result?.data?._id}`);
				setLoading(false);
			} else {
				alert("Submission failed: " + result.message);
			}
		} catch (err: any) {
			setLoading(false);
			console.error(err);
			alert("Error: " + err.message);
		}
	};

	return (
		<div className="container mx-auto max-w-4xl">
			<div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
				<header className="text-center mb-8">
					<h1 className="text-3xl sm:text-4xl font-semibold text-blue-600">
						Health Certificate Generator
					</h1>
					<p className="text-gray-500 font-semibold mt-2">
						Fill out the form below to generate your health certificate PDF.
					</p>
				</header>

				<form
					onSubmit={handleSubmit}
					className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Civil ID */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Civil ID
						</label>
						<input
							type="text"
							name="civilId"
							value={formData.civilId}
							pattern="\d{12}"
							maxLength={12}
							minLength={12}
							required
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Name Arabic */}
					<div>
						<label className="block text-sm font-medium text-gray-700 amiri">
							Name (Arabic)
						</label>
						<input
							type="text"
							name="nameAr"
							value={formData.nameAr}
							dir="rtl"
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 amiri"
						/>
					</div>

					{/* nationalityAr */}
					<div>
						<label className="block text-sm font-medium text-gray-700 amiri">
							Nationality (Arabic)
						</label>
						<input
							type="text"
							name="nationalityAr"
							value={formData.nationalityAr}
							dir="rtl"
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 amiri"
						/>
					</div>

					{/* categoryAr */}
					<div>
						<label className="block text-sm font-medium text-gray-700 amiri">
							Category (Arabic)
						</label>
						<input
							type="text"
							name="categoryAr"
							value={formData.categoryAr}
							dir="rtl"
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 amiri"
						/>
					</div>

					{/* jobAr */}
					<div>
						<label className="block text-sm font-medium text-gray-700 amiri">
							Job (Arabic)
						</label>
						<input
							type="text"
							name="jobAr"
							value={formData.jobAr}
							dir="rtl"
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 amiri"
						/>
					</div>

					{/* companyAr */}
					<div>
						<label className="block text-sm font-medium text-gray-700 amiri">
							Company (Arabic)
						</label>
						<input
							type="text"
							name="companyAr"
							value={formData.companyAr}
							dir="rtl"
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 amiri"
						/>
					</div>

					{/* issueDate */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Issue Date
						</label>
						<input
							type="date"
							name="issueDate"
							value={formData.issueDate}
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* endDate */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							End Date
						</label>
						<input
							type="date"
							name="endDate"
							value={formData.endDate}
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Profile Photo at last right */}
					<div className="md:col-span-2 flex w-[300px] flex-col items-end ml-auto">
						<div>
							<label
								htmlFor="profile-photo"
								className="block text-sm font-medium text-gray-700">
								Profile Photo
							</label>
							<input
								type="file"
								id="profile-photo"
								name="photo"
								accept="image/*"
								required
								onChange={handlePhotoChange}
								className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                file:rounded-full file:border-0 file:text-sm file:font-semibold 
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
							/>
							{photoPreview && (
								<img
									src={photoPreview}
									alt="Photo Preview"
									className="mt-4 rounded-lg w-32 h-32 object-cover shadow-md"
								/>
							)}
						</div>
					</div>

					{/* Submit Button */}
					<div className="md:col-span-2 text-center mt-6">
						<button
							type="submit"
							disabled={loading} // disable button while loading
							className={`w-full md:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 ${
								loading ? "opacity-50 cursor-not-allowed" : ""
							}`}>
							{loading ? (
								<>
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v8H4z"></path>
									</svg>
									Submitting...
								</>
							) : (
								"Submit"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Home;
