import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import { ModeToggle } from "@/components/mode-toggle";
import {Github, LoaderCircle} from "lucide-react";
import * as React from "react";
import authService from "@/services/AuthService.ts";
import {useDispatch, useSelector} from "react-redux";
import {updateRefreshTokenStatus} from "@/store/slice/refreshSlice.ts";
import {checkRefreshCookieExists} from "@/utils/Helper.ts";
import {RootState} from "@/store/store.ts";
import {Navigate} from "react-router-dom";
import {URL_HOME} from "@/constants/routes/appNavigation.ts";
import {useState} from "react";


const LoginPage: React.FC = () => {

    const dispatch = useDispatch();
    dispatch(updateRefreshTokenStatus({exist: checkRefreshCookieExists()}))

    const refreshTokenExist  = useSelector((state:RootState)=>state.refresh.exist)


    if(refreshTokenExist) {
        return ( <Navigate to={URL_HOME}/>)
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isLoading, setIsLoading] = useState<boolean>(false)

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
                <svg width="69" height="92" viewBox="0 0 69 92" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
                    <g filter="url(#filter0_d_474_1771)">
                        <path
                            d="M65 0.673588C24 24.1736 37 83.6736 37 83.6736C22.1558 60.6736 48.5 15.1736 4.5 27.5C4.5 27.5 50.974 6.96485 65 0.673588Z"
                            fill="currentColor"/>
                    </g>
                    <defs>
                        <filter id="filter0_d_474_1771" x="0.5" y="0.673584" width="68.5" height="91"
                                filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix"
                                           values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="4"/>
                            <feGaussianBlur stdDeviation="2"/>
                            <feComposite in2="hardAlpha" operator="out"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_474_1771"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_474_1771" result="shape"/>
                        </filter>
                    </defs>
                </svg>


                Tareon
            </div>
            <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                    <p className="text-lg">
                        &ldquo;Task management, simplified and yours forever.&rdquo;
                    </p>
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

            </div>
        </div>
    </div>
        </>
    )
        ;
};

export default LoginPage;
