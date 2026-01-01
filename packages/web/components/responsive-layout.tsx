"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface ResponsiveLayoutProps {
  children: React.ReactNode
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Layout - Phone mockup */}
      <div className="lg:hidden min-h-screen bg-[#0a0a0f] relative overflow-hidden">
        {/* Starry background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute w-1 h-1 bg-white rounded-full top-[10%] left-[5%] animate-pulse" />
          <div className="absolute w-1 h-1 bg-white rounded-full top-[20%] left-[15%]" />
          <div className="absolute w-1 h-1 bg-white rounded-full top-[15%] left-[85%] animate-pulse" />
          <div className="absolute w-1 h-1 bg-white rounded-full top-[30%] left-[70%]" />
          <div className="absolute w-1 h-1 bg-white rounded-full top-[40%] left-[25%]" />
          <div className="absolute w-1 h-1 bg-white rounded-full top-[50%] left-[90%] animate-pulse" />
          <div className="absolute w-1 h-1 bg-white rounded-full top-[60%] left-[10%]" />
          <div className="absolute w-1 h-1 bg-white rounded-full top-[70%] left-[60%] animate-pulse" />
          <div className="absolute w-1 h-1 bg-white rounded-full top-[80%] left-[40%]" />
          <div className="absolute w-1 h-1 bg-white rounded-full top-[85%] left-[80%]" />
        </div>

        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-[428px] h-[844px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col phone-container">
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">{children}</div>

            <div className="grid grid-cols-3 border-t border-gray-200 shrink-0">
              <Link
                href="/"
                className={`py-4 text-sm font-bold text-center transition-all duration-200 ${
                  pathname === "/" ? "bg-black text-white" : "hover:bg-gray-100 active:bg-gray-200"
                }`}
              >
                HOME
              </Link>
              <Link
                href="/search"
                className={`py-4 text-sm font-bold text-center transition-all duration-200 ${
                  pathname === "/search" ? "bg-black text-white" : "hover:bg-gray-100 active:bg-gray-200"
                }`}
              >
                SEARCH
              </Link>
              <Link
                href="/radar"
                className={`py-4 text-sm font-bold text-center transition-all duration-200 ${
                  pathname === "/radar" ? "bg-black text-white" : "hover:bg-gray-100 active:bg-gray-200"
                }`}
              >
                RADAR
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Full dashboard */}
      <div className="hidden lg:block min-h-screen bg-[#0a0a0f]">
        {/* Starry background */}
        <div className="fixed inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-white rounded-full ${i % 3 === 0 ? "animate-pulse" : ""}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        {children}
      </div>
    </>
  )
}

export function DesktopCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${className}`}>
      {children}
    </div>
  )
}
