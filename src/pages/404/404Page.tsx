import React from "react";
import {Separator} from "@/components/ui/separator.tsx";
import {useTranslation} from "react-i18next";




const NotFoundPage: React.FC = () => {

    const {t} = useTranslation()

    return (
       <div className='flex justify-center items-center h-[100vh] text-3xl space-x-3'>
           <div>
               404
           </div>
           <Separator orientation={"vertical"} className='h-10'/>
           <div>
               {t('thisPageCouldNotBeFound')}
           </div>
       </div>
    );
};

export default NotFoundPage;
