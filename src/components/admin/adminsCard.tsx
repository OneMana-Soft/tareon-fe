import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { TOAST_UNKNOWN_ERROR} from "@/constants/dailog/const.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import adminService, {PostgresUserInterface} from "@/services/AdminService.ts";
import AdminsList from "@/components/admin/adminsList.tsx";
import {useTranslation} from "react-i18next";


const AdminsCard  = () => {

    const { toast } = useToast()

    const usersList = adminService.getAllAdminList()
    const {t} = useTranslation()



    const handleAddAdmin = async (emailId: string) => {
        if(!emailId) return

        for(const ua of usersList.data?.data||[]) {
            if(ua.user_email == emailId){
                toast({
                    title: t('failure'),
                    description: t('userAlreadyAdmin'),
                    variant: "destructive",
                });

                return
            }
        }

        try {
            await adminService.createAdmin({user_email: emailId})
            toast({
                title: t('success'),
                description: t('addedAdmin'),
            });
            await usersList.mutate()

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
            toast({
                title: t('failure'),
                description: `${t('failedToAddAdmin')}: ${errorMessage}`,
                variant: "destructive",
            });
        }
    }

    const handleRemoveAdmin = async (emailId: string) => {
        if(!emailId) return

        try {
            await adminService.removeAdmin({user_email: emailId})
            toast({
                title: t('success'),
                description: `Removed admin`,
            });
            await usersList.mutate()

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : TOAST_UNKNOWN_ERROR;
            toast({
                title: t('failure'),
                description: `${t('failedToRemoveAdmin')}: ${errorMessage}`,
                variant: "destructive",
            });
        }
    }


    return (

        <Card className="w-[30vw]">
            <CardHeader>
                <CardTitle>
                    {t('admins')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AdminsList usersList={usersList.data?.data || [] as PostgresUserInterface[]} handleAddAdmin={handleAddAdmin} handleRemoveAdmin={handleRemoveAdmin}/>
            </CardContent>

        </Card>

    );
};

export default AdminsCard;
