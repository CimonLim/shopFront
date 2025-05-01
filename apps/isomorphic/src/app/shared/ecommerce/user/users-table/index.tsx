'use client';

import { usersData } from '@/data/users-data';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { usersColumns } from './columns';
import Table from '@core/components/table';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import {TableClassNameProps} from "@core/components/table/table-types.ts";
import {exportToCSV} from "@core/utils/export-to-csv.ts";
import cn from "@core/utils/class-names.ts";

export type UsersTableDataType = (typeof usersData)[number];

export default function UsersTable({
   pageSize = 5,
   hideFilters = false,
   hidePagination = false,
   hideFooter = false,
   classNames = {
       container: 'border border-muted rounded-md',
       rowClassName: 'last:border-0',
   },
   paginationClassName,
}: {
    pageSize?: number;
    hideFilters?: boolean;
    hidePagination?: boolean;
    hideFooter?: boolean;
    classNames?: TableClassNameProps;
    paginationClassName?: string;
}) {
    const { table, setData } = useTanStackTable<UsersTableDataType>({
        tableData: usersData,
        columnConfig: usersColumns,
        options: {
            initialState: {
                pagination: {
                    pageIndex: 0,
                    pageSize: pageSize,
                },
            },
            meta: {
                handleDeleteRow: (row) => {
                    setData((prev) => prev.filter((r) => r.id !== row.id));
                    table.resetRowSelection();
                },
                handleMultipleDelete: (rows) => {
                    setData((prev) => prev.filter((r) => !rows.includes(r)));
                    table.resetRowSelection();
                },
            },
            enableColumnResizing: false,
        },
    });

    const selectedData = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);

    function handleExportData() {
        exportToCSV(
            selectedData,
            'ID,Name,Category,Sku,Price,Stock,Status,Rating',
            `product_data_${selectedData.length}`
        );
    }
    return (
        <>
            {!hideFilters && <Filters table={table} />}
            <Table
                table={table}
                variant="modern"
                classNames={classNames}
            />
            {!hideFooter && <TableFooter table={table} onExport={handleExportData} />}
            {!hidePagination && (
                <TablePagination
                    table={table}
                    className={cn('py-4', paginationClassName)}
                />
            )}
        </>
    );
}
