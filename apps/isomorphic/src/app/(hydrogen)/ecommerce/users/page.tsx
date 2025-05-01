import PageHeader from '@/app/shared/page-header';
import UsersTable from '@/app/shared/ecommerce/user/users-table';
import {metaObject} from "@/config/site.config.tsx";
import ExportButton from "@shared//export-button.tsx";
import {productsData} from "@/data/products-data.ts";
import Link from "next/link";
import {routes} from "@/config/routes.ts";
import {Button} from "rizzui/button";
import {PiPlusBold} from "react-icons/pi";
export const metadata = {
    ...metaObject('Users'),
};
const pageHeader = {
  title: 'Users',
  breadcrumb: [
    {
      href: '/users',
      name: 'Users',
    },
    {
      name: 'List',
    },
  ],
};

export default function UsersPage() {
  return (
    <>
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
            <div className="mt-4 flex items-center gap-3 @lg:mt-0">
                <ExportButton
                    data={productsData}
                    fileName="user_data"
                    header="ID,Name,Category,Product Thumbnail,SKU,Stock,Price,Status,Rating"
                />
            </div>
        </PageHeader>
      <UsersTable pageSize={10} />
    </>
  );
}
