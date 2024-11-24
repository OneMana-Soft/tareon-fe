
import * as React from "react"
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Tabs, TabsList, TabsContent, TabsTrigger} from "@/components/ui/tabs.tsx";
import {MyCompletedTaskList} from "@/components/task/myCompletedTaskList.tsx";

const HomePage: React.FC = () => {


    return (
        <div className='h-full flex items-center justify-center'>
            <Card className="">
                <CardHeader>
                    <CardTitle className='flex text-center justify-start items-center'>
                        <Avatar className="h-8 w-8 mr-4">
                            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                            <AvatarFallback>AH</AvatarFallback>
                        </Avatar>{" "}

                        My Tasks</CardTitle>
                    {/*<CardDescription>Deploy your new project in one-click.</CardDescription>*/}
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="upcoming" className="w-[40rem]">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                            <TabsTrigger value="overdue">Overdue</TabsTrigger>
                            <TabsTrigger value="completed">Completed</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upcoming">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Upcoming Tasks</CardTitle>
                                    <CardDescription>
                                        Aane wale tasks
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <></>
                                </CardContent>
                                <CardFooter>
                                    <></>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="overdue">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Upcoming Tasks</CardTitle>
                                    <CardDescription>
                                        Tumse na ho payega
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <></>
                                </CardContent>
                                <CardFooter>
                                    <></>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="completed">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Completed Tasks</CardTitle>
                                    <CardDescription>
                                        ye to ho gaya hei
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <MyCompletedTaskList/>
                                </CardContent>
                                <CardFooter>
                                    <></>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                {/*<CardFooter className="flex justify-between">*/}
                {/*   <></>*/}
                {/*</CardFooter>*/}
            </Card>
        </div>
    )
}

export default HomePage;
