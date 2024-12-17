import { Input } from "@/components/ui/input.tsx";
import { useEffect, useRef, useState } from "react";
import { URL_SEARCH } from "@/constants/routes/appNavigation.ts";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateSearchText } from "@/store/slice/globalSearchSlice.ts";
import {useTranslation} from "react-i18next";

export function Search() {
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const {t} = useTranslation()

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Regular expression to allow only letters, numbers, and spaces
        const isValid = /^[a-zA-Z0-9\s]*$/.test(value);

        if (isValid) {

            setError(""); // Clear error if input is valid
        } else {
            setError("Special characters are not allowed.");
        }
        setSearchQuery(value);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "k") {
                event.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleSearch = () => {
        if (!searchQuery.trim() || error) return;

        if (error) {
            // Prevent search if there's an error
            return;
        }

        dispatch(updateSearchText({ searchText: searchQuery.trim() }));
        navigate(URL_SEARCH);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div>
            <Input
                type="search"
                placeholder={`${t('searchPlaceholder')} ⌘+k`}
                ref={inputRef}
                className="md:w-[100px] lg:w-[300px]"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyPress}
            />
            {searchQuery && error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
