"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HoverLift } from "@/components/animations/MotionWrappers"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <HoverLift>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl border-border/50 shadow-xl bg-card/95 backdrop-blur-xl">
          <DropdownMenuItem onClick={() => setTheme("light")} className="rounded-lg cursor-pointer hover:bg-muted">
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="rounded-lg cursor-pointer hover:bg-muted">
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="rounded-lg cursor-pointer hover:bg-muted">
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </HoverLift>
  )
}
