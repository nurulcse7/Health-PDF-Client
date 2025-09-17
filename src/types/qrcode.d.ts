declare module "qrcode" {
	export interface ToDataURLOptions {
		errorCorrectionLevel?: "low" | "medium" | "quartile" | "high";
		type?: "image/png" | "image/jpeg" | "image/webp";
		quality?: number;
		margin?: number;
		color?: {
			dark?: string;
			light?: string;
		};
		scale?: number;
		width?: number;
	}

	// Named export
	export function toDataURL(
		text: string,
		options?: ToDataURLOptions
	): Promise<string>;

	// Default export
	const qrcode: {
		toDataURL: (text: string, options?: ToDataURLOptions) => Promise<string>;
	};
	export default qrcode;
}
