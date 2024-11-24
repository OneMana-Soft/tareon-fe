// LoginPage.tsx

import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import { ModeToggle } from "@/components/mode-toggle";
import {Github, LoaderCircle} from "lucide-react";
import * as React from "react";
import authService from "@/services/AuthService.ts";


const LoginPage: React.FC = () => {

    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const handleLogin = async (action: () => Promise<void>) => {
        setIsLoading(true);
        try {
            await action();
        } catch (error) {
            console.error('Error logging in:', error);
            // Handle error, show error message, etc.
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>

    <div
        className="container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="absolute right-4 top-4 md:right-8 md:top-8">
                <ModeToggle/>
            </div>


        <div className="relative hidden h-[100vh] flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 dark:bg-zinc-900 bg-sky-900"/>
            <div className="relative z-20 flex items-center text-lg font-medium">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-6 w-6"
                >
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
                </svg>
                Asana Inc
            </div>
            <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                    <p className="text-lg">
                        &ldquo;Kuch to kar le.&rdquo;
                    </p>
                    <footer className="text-sm">- your parents</footer>
                </blockquote>
            </div>
        </div>
        <div className="lg:p-8 min-h-[100vh] flex">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Login
                    </h1>
                </div>
                <div className={cn("grid gap-6")}>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t"/>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            {/*<span className="bg-background px-2 text-muted-foreground">*/}
                            {/*  Or continue with*/}
                            {/*</span>*/}
                        </div>
                    </div>
                    <Button variant="outline" type="button" disabled={isLoading} onClick={()=>handleLogin(authService.loginWithGithub)}>
                        {isLoading ? (
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                        ) : (
                            <Github className="mr-2 h-4 w-4"/>
                        )}{" "}
                        Login with GitHub
                    </Button>

                    <Button variant="outline" type="button" disabled={isLoading} onClick={()=>handleLogin(authService.loginWithGoogle)}>
                        {isLoading ? (
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                        ) : (
                            <div
                                className={`font-['PT_Sans'] className="mr-2 h-4 w-4" pr-2 flex justify-center items-center font-bold`}>G</div>
                        )}{" "}
                        Login with Google
                    </Button>
                </div>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <a
                        href="/terms"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                        href="/privacy"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Privacy Policy
                    </a>
                    .
                </p>
            </div>
        </div>
    </div>
        </>
    )
        ;
};

export default LoginPage;
