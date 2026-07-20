"use client";

import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

export function AdminTopbar() {
  const queryClient = useQueryClient();

  const { data: countData } = useQuery({
    queryKey: ["notificationCount"],
    queryFn: async () => {
      const res = await api.get("/notifications/unread-count");
      return res.data;
    },
    refetchInterval: 30000, // poll every 30s
  });

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications");
      return res.data;
    },
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      return await api.put("/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationCount"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = countData?.count || 0;

  return (
    <header className="h-16 border-b bg-card px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-heading font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full flex items-center justify-center px-1 border-2 border-card">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-xl border-border/50 bg-card/95 backdrop-blur-xl p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <p className="font-heading font-semibold text-sm">Notifications</p>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-primary hover:text-primary gap-1"
                  onClick={() => markAllRead.mutate()}
                >
                  <Check size={12} /> Mark all read
                </Button>
              )}
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {notifications && notifications.length > 0 ? (
                notifications.slice(0, 8).map((n: any) => (
                  <DropdownMenuItem
                    key={n._id}
                    className={`px-4 py-3 cursor-default flex flex-col items-start gap-1 rounded-none border-b border-border/30 last:border-0 ${!n.read ? "bg-primary/5" : ""}`}
                  >
                    <p className={`text-sm leading-tight ${!n.read ? "font-semibold" : ""}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No notifications yet.
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
