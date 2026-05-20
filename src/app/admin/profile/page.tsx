import { PageHeader } from "@/components/layout/page-header";
import { CompanyContactCard } from "@/features/company-profile/components/company-contact-card";
import { CompanyProfileCard } from "@/features/company-profile/components/company-profile-card";
import { getCompanyProfile } from "@/features/company-profile/service";
import { UserProfileCard } from "@/features/users/components/user-profile-card";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const user = await requireRole(["admin"]);
  const profile = getCompanyProfile();

  return (
    <>
      <PageHeader
        title="Profile Admin"
        description="Informasi akun admin dan profile perusahaan."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <UserProfileCard user={user} />
        <CompanyProfileCard profile={profile} />
        <CompanyContactCard profile={profile} />
      </div>
    </>
  );
}
