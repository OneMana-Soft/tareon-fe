
import { MyTaskTable } from "@/components/task/myTaskTable.tsx";
import taskService from "@/services/TaskService.ts";
import columns from "@/components/task/taskColumns.tsx";
import {Suspense} from "react";
import { DataTableSkeleton } from "@/components/tableSkeleton";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Kanban,  List} from "lucide-react";
import {MyTaskKanban} from "@/components/task/myTaskKanban.tsx";




const TaskPage: React.FC = () => {


  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">My tasks</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks
            </p>
          </div>
        </div>


        <Tabs defaultValue="list" className="w-full ">
          <TabsList>
            <TabsTrigger value="list">
              <List className='h-4 w-4 mr-2'/>List
            </TabsTrigger>
            <TabsTrigger value="kanban">
              <Kanban className='h-4 w-4 mr-2'/>Board
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className='p-4'><MyTaskTable/></TabsContent>
          <TabsContent value="kanban" className='p-4'><MyTaskKanban/></TabsContent>
        </Tabs>


      </div>

    </>
  );
};

export default TaskPage;
