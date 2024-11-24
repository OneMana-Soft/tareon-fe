import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { toast, useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import ProfileService from "@/services/ProfileService";
import {
  TOAST_TITLE_FAILURE,
  TOAST_TITLE_SUCCESS,
} from "@/constants/dailog/const";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import MediaService, {
  ATTACHMMENT_UPLOAD_FOR_ALL_PROJECT,
  UploadFileInterfaceRes,
} from "@/services/MediaService";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

const profileFormSchema = z.object({
  teamName: z
    .union([z.string().length(0), z.string().min(4).max(30)])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  jobTitle: z
    .union([z.string().length(0), z.string().min(4).max(30)])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  aboutMe: z
    .union([z.string().length(0), z.string().min(4).max(30)])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface editProfileDialogProps {
  userUUID: string;
  dialogOpenState: boolean;
  setOpenState: (state: boolean) => void;
}

const OtherProfileDialog: React.FC<editProfileDialogProps> = ({
  dialogOpenState,
  setOpenState,
  userUUID,
}) => {
  const profileInfo = ProfileService.getUserProfileForID(userUUID);

  const profileImageRes = MediaService.getMediaURLForID(
    profileInfo.userData?.data.user_profile_object_key || ""
  );

  useEffect(() => {
    if (profileInfo.userData) {
      const defaultValues: Partial<ProfileFormValues> = {
        teamName: profileInfo.userData?.data.user_team_name || "",
        jobTitle: profileInfo.userData?.data.user_job_title || "",
        aboutMe: profileInfo.userData?.data.user_about_me || "",
      };
      form.reset(defaultValues);
    }
  }, [profileInfo.userData]);

  function closeModal() {
    setOpenState(false);
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  const nameIntialsArray = profileInfo.userData?.data.user_name.split(" ") || [
    "Unknown",
  ];

  let nameIntial = nameIntialsArray[0][0].toUpperCase();

  if (nameIntialsArray?.length > 1) {
    nameIntial += nameIntialsArray[1][0].toUpperCase();
  }

  return (
    <Dialog onOpenChange={closeModal} open={dialogOpenState}>
      {/*<DialogTrigger asChild>*/}
      {/*    <Button variant="secondary">Save</Button>*/}
      {/*</DialogTrigger>*/}
      <DialogContent className="sm:max-w-fit">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>Edit profile</DialogDescription>
        </DialogHeader>
        <div className="flex flex-row ">
          <div className="flex flex-col justify-center items-center h-full mr-12">
            <div className="flex relative justify-center items-center mb-3">
              <Avatar className="h-48 w-48">
                <AvatarImage
                  src={profileImageRes.mediaData?.url}
                  alt="Profile Image"
                />
                <AvatarFallback>{nameIntial}</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center">
              {profileInfo.userData?.data.user_name}
            </div>
            <div className="text-muted-foreground">
              {profileInfo.userData?.data.user_email}
            </div>
          </div>

          <Separator orientation="vertical" className="mx-2 " />

          <div className="ml-12 mr-2">
            <Form {...form}>
              <form className="space-y-8">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Tile</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={true} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teamName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Name</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={true} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="aboutMe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About me</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none"
                          readOnly={true}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Update</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtherProfileDialog;
