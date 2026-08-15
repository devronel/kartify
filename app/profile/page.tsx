import { ChangePasswordForm } from "@/components/profile/personal-information/ChangePasswordForm";
import { PersonalInfoForm } from "@/components/profile/personal-information/PersonalInfoForm";
import { ProfileAvatarCard } from "@/components/profile/personal-information/ProfileAvatarCard";

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <ProfileAvatarCard />
      <PersonalInfoForm />
      <ChangePasswordForm />
    </div>
  )
}
