import EcommerceDashboard from '@/app/shared/ecommerce/dashboard';
import { metaObject } from '@/config/site.config';
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options.ts";

export const metadata = {
  ...metaObject('E-Commerce'),
};

export default async function eCommerceDashboardPage() {
  const session = await getServerSession(authOptions);

  return <EcommerceDashboard initialSession={session} />;
}
