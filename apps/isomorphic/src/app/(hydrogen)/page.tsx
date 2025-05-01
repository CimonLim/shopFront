import { metaObject } from '@/config/site.config';

import eCommerceDashboardPage from "@/app/(hydrogen)/ecommerce/page.tsx";

export const metadata = {
  ...metaObject(),
};

export default async function mainDashBoardPage() {
  // return <>Hello</>;

  return eCommerceDashboardPage();
}
