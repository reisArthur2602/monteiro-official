import type { Metadata } from "next";

import { getPublicOfficeProfile } from "@/app/(authenticated)/templates/upsert/queries/get-office-profile";

import { AcceptInvitationForm } from "./feature/accept-invitation-form";
import { InvalidInvitationCard } from "./feature/invalid-invitation-card";
import { InviteBrandPanel } from "./feature/invite-brand-panel";
import { getInvitationByToken } from "./queries/get-invitation-by-token";

export const metadata: Metadata = {
  title: "Criar senha",
};

type InvitePageProps = {
  params: Promise<{ token: string }>;
};

const InvitePage = async ({ params }: InvitePageProps) => {
  const { token } = await params;

  const invitation = await getInvitationByToken(token);
  const office = getPublicOfficeProfile();

  return (
    <main className="grid min-h-dvh lg:grid-cols-[minmax(380px,0.92fr)_minmax(0,1.08fr)]">
      <InviteBrandPanel invitation={invitation} />

      <section className="flex items-center justify-center bg-background p-6 sm:p-10">
        {invitation ? (
          <AcceptInvitationForm token={token} invitation={invitation} />
        ) : (
          <InvalidInvitationCard officeEmail={office.email} />
        )}
      </section>
    </main>
  );
};

export default InvitePage;
