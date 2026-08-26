import { ChangePasswordForm } from "@/components/profile/personal-information/change-password-form";
import { PersonalInfoForm } from "@/components/profile/personal-information/personal-info-form";
import { ProfileAvatarCard } from "@/components/profile/personal-information/profile-avatar-card";
import { apiServer } from "@/lib/api-server";

export const metadata = {
  title: "Kartify - My Profile"
};

export default async function ProfilePage() {

  const response = await apiServer('/api/account/profile');

  if (!response.data.success) {
    throw new Error('Failed to load user profile');
  }

  const payload = response.data.payload;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <ProfileAvatarCard />
      <PersonalInfoForm 
        firstName={payload.firstName}
        lastName={payload.lastName}
        phone={payload.phone ?? ''}
        dateOfBirth={payload.dateOfBirth ?? ''}
        gender={payload.gender ?? ''}
      />
      <ChangePasswordForm />
    </div>
  )
}
