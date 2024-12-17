import { zodResolver } from "@hookform/resolvers/zod";
import {  useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
 TOAST_UNKNOWN_ERROR,
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
import { Trash} from "lucide-react";
import {useTranslation} from "react-i18next";
import {AppLanguageCombobox} from "@/components/dialog/appLanguageCombobox.tsx";

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
  language: z.string({
    required_error: "Please select a language.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface editProfileDialogProps {
  dialogOpenState: boolean;
  setOpenState: (state: boolean) => void;
}

const EditProfileDialog: React.FC<editProfileDialogProps> = ({
  dialogOpenState,
  setOpenState,
}) => {
  const profileInfo = ProfileService.getSelfUserProfile();

  const profileImageRes = MediaService.getMediaURLForID(
    profileInfo.userData?.data.user_profile_object_key || ""
  );
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedImageFile, selectedImageSetFile] = useState<File | null>(null);
  const {t} = useTranslation()


  useEffect(() => {
    if (profileImageRes.mediaData?.url) {
      setSelectedImage(profileImageRes.mediaData.url);
    }
  }, [profileImageRes.mediaData]);

  useEffect(() => {
    if (profileInfo.userData) {
      const defaultValues: Partial<ProfileFormValues> = {
        teamName: profileInfo.userData?.data.user_team_name || "",
        jobTitle: profileInfo.userData?.data.user_job_title || "",
        aboutMe: profileInfo.userData?.data.user_about_me || "",
        language: profileInfo.userData?.data.user_app_lang || "en",
      };
      form.reset(defaultValues);
    }
  }, [profileInfo.userData]);

  const { toast } = useToast();

  const removeImage = () => {
    setSelectedImage("");
    selectedImageSetFile(null);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    let profileKey = profileInfo.userData?.data.user_profile_object_key || "";

    if (selectedImage == "" && selectedImageFile == null) {
      profileKey = "";
    }
    if (selectedImageFile) {
      const imageUploadRes = await MediaService.uploadMedia(
        selectedImageFile,
        ATTACHMMENT_UPLOAD_FOR_ALL_PROJECT
      );
      const uploadMediaRes: UploadFileInterfaceRes = imageUploadRes.data;
      profileKey = uploadMediaRes.object_name;
    }

    try {
      await ProfileService.UpdateProfile({
        user_about_me:
            data.aboutMe || profileInfo.userData?.data.user_about_me || "",
        user_job_title:
            data.jobTitle || profileInfo.userData?.data.user_job_title || "",
        user_profile_key: profileKey,
        user_team_name:
            data.teamName || profileInfo.userData?.data.user_team_name || "",
        user_app_lang:
            data.language || profileInfo.userData?.data.user_app_lang || "en",
      });

      toast({
        title: t('success'),
        description: t('updateUserProfile'),
      });

    }catch (e) {

      const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;

      toast({
        title: t('failure'),
        description: `${t('failedToUpdateProfile')}: ${errorMessage}`,
      });

    }

    profileInfo.userMutate();

    closeModal(); // Close dialog after submission
  };

  function closeModal() {
    setOpenState(false);
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataURL = reader.result as string;
        setSelectedImage(imageDataURL);
      };
      reader.readAsDataURL(file);
      selectedImageSetFile(file);
    }
  };

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
          <DialogTitle>{t('profile')}</DialogTitle>
          <DialogDescription>{t('editProfile')}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-row ">
          <div className="flex flex-col justify-center items-center h-full mr-12">
            <div className="flex relative justify-center items-center mb-3">
              <Avatar className="h-48 w-48">
                <AvatarImage src={selectedImage || ""} alt="Profile Image" />
                <AvatarFallback>{nameIntial}</AvatarFallback>
              </Avatar>
              <div className="h-48 w-48 absolute flex justify-center items-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100">
                <label
                  htmlFor="imageUpload"
                  className="h-full w-full flex justify-center items-center cursor-pointer"
                >
                  <div className="rounded-lg text-white text-sm font-bold">
                    {t('edit')}
                  </div>
                </label>
              </div>
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            {selectedImage && (
              <Button variant="outline" className="mb-2" onClick={removeImage}>
                <Trash className="h-4 w-4 mr-2" />{t('removeImage')}
              </Button>
            )}

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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobTitle')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>{t('teamName')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>{t('aboutMe')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t('language')}</FormLabel>
                          <AppLanguageCombobox
                              onLangChange={field.onChange}
                              userLang={field.value}
                          />
                          <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter>
                  <Button type="submit">{t('update')}</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
