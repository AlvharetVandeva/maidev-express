import type { CompanyProfile } from "@/features/company-profile/types";

export function getCompanyProfile(): CompanyProfile {
  return {
    name: "Maidev Express",
    kind: "Layanan pengiriman darat untuk UMKM",
    description:
      "Maidev Express hadir untuk membantu UMKM mengirimkan barang dengan layanan yang ringan, ramah, cepat, dan terpercaya ke berbagai wilayah Indonesia.",
    phone: "+62 812-3456-7890",
    email: "info@cargokulite.id",
    address: "Jl. Merdeka No. 123, Jakarta Pusat",
    hours: "Senin - Sabtu, 08.00 - 17.00 WIB",
  };
}
