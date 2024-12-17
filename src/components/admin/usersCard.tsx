import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {TOAST_UNKNOWN_ERROR} from "@/constants/dailog/const.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import adminService from "@/services/AdminService.ts";
import UsersList from "@/components/admin/usersList.tsx";
import {UserProfileDataInterface} from "@/services/ProfileService.ts";
import {useTranslation} from "react-i18next";



const UsersCard  = () => {

    const { toast } = useToast()
    const {t} = useTranslation()


    const usersList = adminService.getAllUsersList()


    const handleDelete = async (id: string) => {
        if(!id) return

        try {
            await adminService.deactivateUser({user_uuid: id})
            toast({
                title:  t('success'),
                description: t('deletedUser'),
            });
            await usersList.mutate()

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
            toast({
                title: t('failure'),
                description: `${t('failedToDeleteUser')}: ${errorMessage}`,
                variant: "destructive",
            });
        }
    }

    const handleUnDelete = async (id: string) => {
        if(!id) return

        try {
            await adminService.activateUser({user_uuid: id})
            toast({
                title:  t('success'),
                description: t('unDeletedUser'),
            });
            await usersList.mutate()

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
            toast({
                title: t('failure'),
                description: `${t('failedToUnDeleteUser')}: ${errorMessage}`,
                variant: "destructive",
            });
        }
    }


    return (

        <Card className="w-[30vw]">
            <CardHeader>
                <CardTitle>
                    {t('users')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <UsersList usersList={usersList.data?.data||[] as UserProfileDataInterface[]} handleDeleteUser={handleDelete} handleUnDeleteUser={handleUnDelete}/>
            </CardContent>

        </Card>

    );
};

export default UsersCard;
