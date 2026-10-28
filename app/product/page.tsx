import { redirect } from "next/navigation";

export const metadata = {
  title: "Product Launch Studio · Byreel",
  description: "Generate cinematic 3D motion launch videos for SaaS and physical goods.",
};

export default function ProductPage() {
  redirect("/dashboard?section=product-launch");
}
