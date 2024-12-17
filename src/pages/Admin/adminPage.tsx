import React from "react";
import AdminsCard from "@/components/admin/adminsCard.tsx";
import UsersCard from "@/components/admin/usersCard.tsx";
import {useTranslation} from "react-i18next";




const AdminPage: React.FC = () => {

    const {t} = useTranslation()

    return (
        <>
            <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex space-x-3 items-center justify-start ">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">{t('adminControl')}</h2>

                    </div>


                </div>


                <div className='flex gap-x-6'>
                    <AdminsCard />
                    <UsersCard/>
                </div>


            </div>

        </>
    );
};

export default AdminPage;
