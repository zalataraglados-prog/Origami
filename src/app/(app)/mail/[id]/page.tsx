import { notFound } from "next/navigation";
import { getEmailById, getEmailAttachments } from "@/actions/email";
import { MailDetail } from "@/components/mail-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MailDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [email, attachmentsList] = await Promise.all([
    getEmailById(id),
    getEmailAttachments(id),
  ]);

  if (!email) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b p-2 md:hidden">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回
          </Link>
        </Button>
      </div>
      <div className="flex-1">
        <MailDetail email={email} attachments={attachmentsList} />
      </div>
    </div>
  );
}
