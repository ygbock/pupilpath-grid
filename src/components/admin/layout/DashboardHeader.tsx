import { Bell, Search, User, Settings, LogOut, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { ChangePasswordDialog } from "@/components/account/ChangePasswordDialog";
import { useHasRole } from "@/hooks/useRole";

export function DashboardHeader() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showRotateBanner, setShowRotateBanner] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const { has: isAdmin } = useHasRole("admin");

  useEffect(() => {
    const loadUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserProfile({
          full_name: user.user_metadata?.full_name || "",
          email: user.email,
          profile_image_url: user.user_metadata?.avatar_url,
          password_rotated: user.user_metadata?.password_rotated ?? false,
        });
        // Show rotation banner for admins who haven't rotated yet
        const rotated = !!user.user_metadata?.password_rotated;
        setShowRotateBanner(isAdmin && !rotated);
      } else {
        setShowRotateBanner(false);
      }
    };
    loadUserProfile();
  }, [isAdmin]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
      });
    } else {
      navigate("/auth");
    }
  };

  const getInitials = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <SidebarTrigger />
          <div className="relative hidden md:block md:w-80 md:max-w-sm flex-shrink-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search students, classes, or records..." 
              className="pl-10 bg-background/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 px-1 py-0 text-xs bg-destructive">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userProfile?.profile_image_url} alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userProfile?.full_name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userProfile?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {showRotateBanner && (
        <div className="px-4 sm:px-6 py-2 bg-amber-50 border-t border-amber-200 text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>
              For security, please change your admin password now.
            </span>
          </div>
          <div>
            <Button size="sm" variant="outline" onClick={() => setShowPasswordDialog(true)}>Change password</Button>
          </div>
        </div>
      )}
      <ChangePasswordDialog
        open={showPasswordDialog}
        onOpenChange={(open) => {
          setShowPasswordDialog(open);
          if (!open) {
            // Re-check profile to hide banner after rotation
            supabase.auth.getUser().then(({ data: { user } }) => {
              const rotated = !!user?.user_metadata?.password_rotated;
              setShowRotateBanner(isAdmin && !rotated);
            });
          }
        }}
        onRotated={() => setShowRotateBanner(false)}
      />
    </header>
  );
}