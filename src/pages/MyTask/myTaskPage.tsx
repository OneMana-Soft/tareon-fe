import { MyTaskTable } from "@/components/task/myTaskTable.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Kanban,  List} from "lucide-react";
import {MyTaskKanban} from "@/components/task/myTaskKanban.tsx";
import {useTranslation} from "react-i18next";


const TaskPage: React.FC = () => {
  const {t} = useTranslation()


  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex overflow-x-auto">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{t('myTasks')}</h2>
            <p className="text-muted-foreground">
              {t('hereAListOfYourTask')}
            </p>
          </div>
        </div>


        <Tabs defaultValue="list" className="w-full overflow ">
          <TabsList>
            <TabsTrigger value="list">
              <List className='h-4 w-4 mr-2'/>{t('list')}
            </TabsTrigger>
            <TabsTrigger value="kanban">
              <Kanban className='h-4 w-4 mr-2'/>{t('board')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className='p-4'><MyTaskTable/></TabsContent>
          <TabsContent value="kanban" className='p-4 overflow'><MyTaskKanban/></TabsContent>
        </Tabs>


      </div>

    </>
  );
};

export default TaskPage;
