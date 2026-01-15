"use client";

import { User } from "lucide-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Admin User</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(0_35%_30%)] text-white">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}
