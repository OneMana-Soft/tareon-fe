import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import MediaService from "@/services/MediaService.ts";
import ProfileService from "@/services/ProfileService.ts";
import { openEditProfilePopup } from "@/store/slice/popupSlice.ts";
import { useDispatch } from "react-redux";
import {getNameInitials} from "@/utils/Helper.ts";
import {useTranslation} from "react-i18next";
import profileService from "@/services/ProfileService.ts";
import {useNavigate} from "react-router-dom";

export function UserNav() {
  const dispatch = useDispatch();

  const profileInfo = ProfileService.getSelfUserProfile();
  const profileImageRes = MediaService.getMediaURLForID(
    profileInfo.userData?.data.user_profile_object_key || ""
  );
  const {t} = useTranslation()
  const navigate = useNavigate()


  const nameInitial = getNameInitials(profileInfo.userData?.data.user_name);

  const handleLogout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    await profileService.logout()
    navigate("/")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={profileImageRes.mediaData?.url || ""}
              alt="Profile icon"
            />
            <AvatarFallback>{nameInitial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profileInfo.userData?.data.user_name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {profileInfo.userData?.data.user_email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              dispatch(openEditProfilePopup());
            }}
          >
            {t('profile')}
            {/*<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem onClick={handleLogout}>
          {t('logOut')}
          {/*<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>*/}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
