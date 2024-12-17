import React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {ClipboardList, List, Paperclip, Users} from "lucide-react";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store.ts";
import {TaskResult} from "@/components/globalSearch/taskSearch.tsx";
import {ProjectResult} from "@/components/globalSearch/projectSearch.tsx";
import {AttachmentResult} from "@/components/globalSearch/attachmentsSearch.tsx";
import {UserResult} from "@/components/globalSearch/searchUser.tsx";
import {useTranslation} from "react-i18next";



const SearchPage: React.FC = () => {

    const searchQuery = useSelector((state:RootState)=>state.globalSearch.searchText)
    const {t} = useTranslation()

    return (
        <div className='p-2 ml-4 mt-4 flex-col space-y-3'>
            <div className='text-lg'>
                {`"${searchQuery}" search result`}
            </div>


                <Tabs defaultValue="tasks" className="w-full ">
                    <TabsList>
                        <TabsTrigger value="tasks">
                            <List className='h-4 w-4 mr-2'/>{t('tasks')}
                        </TabsTrigger>
                        <TabsTrigger value="projects">
                            <ClipboardList className='h-4 w-4 mr-2'/>{t('projects')}
                        </TabsTrigger>
                        <TabsTrigger value="attachments">
                            <Paperclip className='h-4 w-4 mr-2'/>{t('attachments')}
                        </TabsTrigger>
                        <TabsTrigger value="users">
                            <Users className='h-4 w-4 mr-2'/>{t('users')}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="tasks" className='p-4'><TaskResult/></TabsContent>
                    <TabsContent value="projects" className='p-4'><ProjectResult/></TabsContent>
                    <TabsContent value="attachments" className='p-4'><AttachmentResult/></TabsContent>
                    <TabsContent value="users" className='p-4'><UserResult/></TabsContent>

                </Tabs>


        </div>
    );
};

export default SearchPage;
