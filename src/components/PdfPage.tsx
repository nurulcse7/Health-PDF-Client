import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "qrcode";
import img from "../assets/Logo3.png";
import img1 from "../assets/kuwait.png";
import img2 from "../assets/logo.jpg";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

export default function PdfPage() {
	const { id } = useParams<{ id: string }>();
	const [data, setData] = useState<any>(null);
	const templateRef = useRef<HTMLDivElement>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!id) return;
		fetch(`http://localhost:5000/api/certificate/${id}`)
			.then(res => res.json())
			.then(res => setData(res.data))
			.catch(console.error);
	}, [id]);

	const generatePDF = async () => {
		const element = templateRef.current;
		if (!element) return;

		setLoading(true); // start loading

		try {
			// Convert div → PNG
			const dataUrl = await toPng(element, {
				cacheBust: true,
				backgroundColor: "#ffffff",
				pixelRatio: 3,
			});

			// Create PDF
			const pdf = new jsPDF({
				orientation: "portrait",
				unit: "mm",
				format: "a4",
			});

			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();

			// Actual DOM size in pixels
			const img = new Image();
			img.src = dataUrl;

			img.onload = () => {
				const imgWidth = img.width;
				const imgHeight = img.height;

				// Aspect ratio preserve
				const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
				const newWidth = imgWidth * ratio;
				const newHeight = imgHeight * ratio;

				// Center align (x,y)
				const x = (pdfWidth - newWidth) / 2;
				const y = (pdfHeight - newHeight) / 2;

				pdf.addImage(dataUrl, "PNG", x, y, newWidth, newHeight);
				pdf.save("Health_Fitness_Certificate.pdf");

				setLoading(false); // stop loading
			};
		} catch (error) {
			console.error("PDF generation error:", error);
			setLoading(false); // stop loading on error too
		}
	};
	if (!data) return <p className="text-center mt-5">Loading...</p>;

	return (
		<div className="">
			<div className="flex justify-center pb-3">
				<button
					onClick={generatePDF}
					disabled={loading}
					className={`mt-4 px-4 py-2  rounded text-white ${
						loading
							? "bg-gray-400 cursor-not-allowed"
							: "bg-blue-600 cursor-pointer hover:bg-blue-700"
					}`}>
					{loading ? "Generating..." : "Download PDF"}
				</button>
			</div>

			<div className="flex justify-center">
				{/* Actual PDF template (no mx-auto) */}
				<div
					ref={templateRef}
					className="bg-white w-[210mm] py-7 px-[60px]  shadow-md  text-black">
					{/* Header */}
					<div className="flex justify-between items-center mb-4 px-3">
						<img src={img1} alt="kuwait" className="w-[28mm] h-[20mm]" />
						<div className="text-center">
							<h2 className="text-sm font-bold">State of Kuwait</h2>
							<h1 className="text-lg font-bold mt-1">Ministry of Health</h1>
						</div>
						<img src={img2} alt="logo" className="w-[22mm]" />
						<div className="text-right font-bold text-[20px] font-arabic-lateef">
							<p className=" font-bold">دولة الكـــــويت</p>
							<p className="">وزارة الصحـــة</p>
						</div>
					</div>

					<div className="border-[1px] border-gray-black px-[10px] py-[15px]">
						{/* Top Title Section */}
						<div className="text-center">
							<h2 className=" font-arabic text-[14px] font-semibold inline-block border-b-2 border-black pb-[2px] m-0">
								شهادة اللياقة الصحية
							</h2>
							<br />
							<h1 className="text-[16px] font-semibold inline-block border-b-2 border-black pb-[2px] my-[2mm]">
								Health Fitness Certificate
							</h1>
						</div>

						{/* QR + Photo */}
						<div className="flex justify-between mt-4">
							<div className="pb-2 pl-[20px]">
								{" "}
								<QRCodeDisplay text={`http://localhost:3000/pdf/${id}`} />
							</div>
							<div className="pt-2 pr-1">
								<img
									src={data?.photoUrl}
									alt="Photo"
									className="w-[32mm] h-[30mm] border border-black object-cover p-[1px]"
								/>
							</div>
						</div>

						{/* Table */}
						<table className="w-full mt-4 border border-gray-400 border-collapse">
							<tbody>
								<tr className="bg-[#53ff53] border-b border-t-2 border-gray-400 h-[35px]">
									<td className="px-2 font-bold text-[15px] whitespace-nowrap overflow-hidden text-ellipsis">
										Civil ID :
									</td>
									<td className="text-center font-bold text-[14px]  h-[35px] whitespace-nowrap overflow-hidden text-ellipsis">
										{data?.civilId}
									</td>
									<td className="px-2 text-right font- whitespace-nowrap overflow-hidden text-ellipsis">
										: الرقم المدني
									</td>
								</tr>

								<tr className="border-b border-gray-400 h-[35px]">
									<td className="px-2 font-bold text-[15px] whitespace-nowrap overflow-hidden text-ellipsis">
										Name :
									</td>
									<td className="text-center font-bold text-[14px] h-[35px] whitespace-nowrap overflow-hidden text-ellipsis">
										{data?.nameAr}
									</td>
									<td className="px-2 text-right font- whitespace-nowrap overflow-hidden text-ellipsis">
										: الاسم
									</td>
								</tr>

								<tr className="border-b border-gray-400 h-[35px]">
									<td className="px-2 font-bold text-[15px] whitespace-nowrap overflow-hidden text-ellipsis">
										Nationality :
									</td>
									<td className="text-center font-bold text-[14px] h-[35px] whitespace-nowrap overflow-hidden text-ellipsis">
										{data?.nationalityAr}
									</td>
									<td className="px-2 text-right font- whitespace-nowrap overflow-hidden text-ellipsis">
										: الجنسية
									</td>
								</tr>

								<tr className="border-b border-gray-400 h-[35px]">
									<td className="px-2 font-bold text-[15px] whitespace-nowrap overflow-hidden text-ellipsis">
										Category :
									</td>
									<td className="text-center font-bold text-[14px] h-[35px] whitespace-nowrap overflow-hidden text-ellipsis">
										{data?.categoryAr}
									</td>
									<td className="px-2 text-right font- whitespace-nowrap overflow-hidden text-ellipsis">
										: الفئة
									</td>
								</tr>

								<tr className="border-b border-gray-400 h-[35px]">
									<td className="px-2 font-bold text-[15px] whitespace-nowrap overflow-hidden text-ellipsis">
										Job :
									</td>
									<td className="text-center font-bold text-[14px] h-[35px] whitespace-nowrap overflow-hidden text-ellipsis">
										{data?.jobAr}
									</td>
									<td className="px-2 text-right font- whitespace-nowrap overflow-hidden text-ellipsis">
										: المهنة
									</td>
								</tr>

								<tr className="border-b border-gray-400 h-[35px]">
									<td className="px-2 font-bold text-[15px] whitespace-nowrap overflow-hidden text-ellipsis">
										Company :
									</td>
									<td className="text-center font-bold text-[14px] h-[35px] whitespace-nowrap overflow-hidden text-ellipsis">
										{data?.companyAr}
									</td>
									<td className="px-2 text-right font- whitespace-nowrap overflow-hidden text-ellipsis">
										: مكان العمل
									</td>
								</tr>

								<tr className="border-b border-gray-400 h-[35px]">
									<td className="px-2 font-bold text-[15px] whitespace-nowrap overflow-hidden text-ellipsis">
										Issue Date :
									</td>
									<td className="text-center font-bold text-[14px] h-[35px] whitespace-nowrap overflow-hidden text-ellipsis">
										{data?.issueDate
											? new Date(data.issueDate).toLocaleDateString("en-GB")
											: ""}
									</td>
									<td className="px-2  text-right font- whitespace-nowrap overflow-hidden text-ellipsis">
										: تاريخ الاصدار
									</td>
								</tr>

								<tr className="border-b border-gray-400 h-[35px]">
									<td className="px-2 font-bold text-[15px] whitespace-nowrap overflow-hidden text-ellipsis">
										End Date :
									</td>
									<td className="text-center font-bold text-[14px] h-[35px] whitespace-nowrap overflow-hidden text-ellipsis">
										{data?.endDate
											? new Date(data.endDate).toLocaleDateString("en-GB")
											: ""}
									</td>
									<td className="px-2 text-right font- whitespace-nowrap overflow-hidden text-ellipsis">
										: تاريخ الانتهاء
									</td>
								</tr>

								<tr className="border-b border-gray-400 h-[35px]">
									<td className="px-2 font-bold text-[15px] whitespace-nowrap overflow-hidden text-ellipsis"></td>
									<td className="text-center font-bold text-[14px] h-[35px] whitespace-nowrap overflow-hidden text-ellipsis">
										تلغى البطاقة مع تاريخ إنتهائها أو أنتهاء الإقامة أيهما أقرب
									</td>
									<td className="px-2 text-right font- whitespace-nowrap overflow-hidden text-ellipsis">
										: ملحوظة
									</td>
								</tr>
							</tbody>
						</table>
						{/* Food Handler Section */}
						<div className="flex justify-between items-center pt-[40px] pb-[70px]">
							<h2 className="text-[13px] font-bold mt-0">
								Food Handlers Examination Section
							</h2>
							<div>
								<img src={img} className="w-[22mm]" alt="Logo3" />
							</div>
							<h2 className="mt-2 font-medium">
								قسم صحة متداولي الغذية والفئات الخرى
							</h2>
						</div>
					</div>

					{/* Footer */}
					<div className="mt-4 text-sm space-y-1 pl-4">
						{/* Arabic Section */}
						<div className="text-right space-y-1 text-[12px] font-medium">
							<p className="">
								.تم إنشاء هذا التقرير إلكترونيا من خلال نظام وزارة الصحة حيث أن
								النموذج معتمد من وزارة الصحة ولا يحتاج الي ختم أو توقيع يدوي
							</p>
							<p className="">
								.أي عملية تلاعب / تعديل / تزوير في النموذج يحاسب عليه حسب
								القوانين في دولة الكويت
							</p>
						</div>

						{/* Divider */}
						<div className="my-3 border-t-2 border-gray-400"></div>

						{/* English Section */}
						<div className="space-y-1 text-[12px] font-medium">
							<p>
								This report was created electronically through the Ministry of
								Health's system, and the certification is approved by the
								Ministry of Health and does not require a stamp or signature.
							</p>
							<p>
								Any unauthorized manipulation of the form will be subject to
								legal action as per the laws of the State of Kuwait.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function QRCodeDisplay({ text }: { text: string }) {
	const [qrSrc, setQrSrc] = useState<string | null>(null);

	useEffect(() => {
		QRCode.toDataURL(text, {
			width: 1000,
			margin: 1,
			scale: 10,
		})
			.then(setQrSrc)
			.catch(console.error);
	}, [text]);

	if (!qrSrc) return null;
	return <img src={qrSrc} alt="QR code" className="w-[1.3in] h-[1.2in]" />;
}
