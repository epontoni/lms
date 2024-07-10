"use client";

import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pen, Pencil, Trash } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Course = {
//   id: string;
//   amount: number;
//   status: "pending" | "processing" | "success" | "failed";
//   email: string;
// };

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") || "0");
      const formatted = formatPrice(price);

      return <>{formatted}</>;
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;
      return (
        <Badge variant={isPublished ? "default" : "secondary"}>
          {isPublished ? "Published" : "Unpublished"}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <Button asChild variant="secondary" className="hover:bg-slate-200">
          <Link href={`/teacher/courses/${id}`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
        //     <DropdownMenu>
        //       <DropdownMenuTrigger asChild>
        //         <Button variant="ghost" className="h-8 w-8 p-0">
        //           <span className="sr-only">Open menu</span>
        //           <MoreHorizontal className="h-4 w-4" />
        //         </Button>
        //       </DropdownMenuTrigger>
        //       <DropdownMenuContent align="end">
        //         <Link href={`/teacher/courses/${id}`}>
        //           <DropdownMenuItem>
        //             <Pencil className="h-4 w-4 mr-2" />
        //             Edit
        //           </DropdownMenuItem>
        //         </Link>
        //         <Link href={`/teacher/courses/${id}`}>
        //           <DropdownMenuItem>
        //             <Trash className="h-4 w-4 mr-2" />
        //             Delete
        //           </DropdownMenuItem>
        //         </Link>
        //         <DropdownMenuLabel>Actions</DropdownMenuLabel>
        //         <DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>
        //           Copy payment ID
        //         </DropdownMenuItem>
        //         <DropdownMenuSeparator />
        //         <DropdownMenuItem>View customer</DropdownMenuItem>
        //         <DropdownMenuItem>View payment details</DropdownMenuItem>
        //       </DropdownMenuContent>
        //     </DropdownMenu>
      );
    },
  },
];
