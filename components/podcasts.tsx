"use client";

import React, {useEffect, useRef, useState} from "react";
import CompactCard from "./episodeCards/compact-card";
import {usePodcastsStore} from "@/stores/podcasts-store";
import {Button} from "./ui/button";
import {
    EllipsisVertical,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {Podcast} from "@/types/podcast";
import PodcastCard from "./podcast-card";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {DropdownMenuCheckboxItem} from "@radix-ui/react-dropdown-menu";

const Podcasts = () => {
    const {podcasts, keyword, isLoading} = usePodcastsStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isGridLayout, setIsGridLayout] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem("podcasts-grid");
            return stored === "true";
        }
        return false;
    });

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const {scrollLeft, scrollWidth, clientWidth} =
                scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({left: -227, behavior: "smooth"});
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({left: +227, behavior: "smooth"});
        }
    };

    useEffect(() => {
        checkScrollButtons();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", checkScrollButtons);
            return () => container.removeEventListener("scroll", checkScrollButtons);
        }
    }, [podcasts]);


    useEffect(() => {
        localStorage.setItem('podcasts-grid', isGridLayout.toString());
    }, [isGridLayout]);

    return (
        <>
            {keyword && (
                <>
                    <div
                        className="flex justify-between items-center border-b border-border sticky top-12 bg-background z-40 px-4 mt-12 mb-[10px]">
                        <h1 className="text-[16px] font-semibold ">
                            Top podcasts for {keyword}
                        </h1>
                        <div className="flex items-center gap-2">
                            {!isGridLayout &&
                                <>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="z-10 h-8 w-8 shadow-lg bg-background/80 backdrop-blur-sm cursor-pointer"
                                        onClick={scrollLeft}
                                    >
                                        <ChevronLeft className="h-6 w-6 text-white"/>
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="z-10 h-8 w-8 shadow-lg bg-background/80 backdrop-blur-sm cursor-pointer"
                                        onClick={scrollRight}
                                    >
                                        <ChevronRight className="h-6 w-6 text-white"/>
                                    </Button>
                                </>
                            }
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div className={"cursor-pointer"}>
                                        <EllipsisVertical width={20} height={20}/>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className={'bg-gradient-to-t from-accent1 to-accent2 text-[14px]'}>
                                    {
                                        isGridLayout ?
                                            (
                                                <DropdownMenuCheckboxItem
                                                    className={'cursor-pointer py-2 px-3 text-[14px]'}
                                                    checked={isGridLayout}
                                                    onCheckedChange={() => setIsGridLayout(!isGridLayout)}
                                                >
                                                    Switch to scroll layout
                                                </DropdownMenuCheckboxItem>
                                            ) :
                                            (
                                                <DropdownMenuCheckboxItem
                                                    className={'cursor-pointer py-2 px-3 text-[14px]'}
                                                    checked={isGridLayout}
                                                    onCheckedChange={() => setIsGridLayout(!isGridLayout)}
                                                >
                                                    Switch to grid layout
                                                </DropdownMenuCheckboxItem>
                                            )
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="flex-1 flex gap-2 w-full overflow-y-scroll ">
                        {podcasts && podcasts.length > 0 ? (
                            <div className="relative w-full mt-2">
                                <div
                                    ref={scrollContainerRef}
                                    className={`px-4 gap-2 w-full overflow-y-hidden max-w-full grow relative scrollbar-hide 
                                    ${isGridLayout ? 'grid grid-cols-2 md:grid-cols-5 gap-2' : 'inline-flex overflow-x-auto'}`}
                                    onScroll={checkScrollButtons}
                                >
                                    {podcasts?.map((podcast: Podcast, index: number) => (
                                        <PodcastCard podcast={podcast} key={index}/>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center absolute inset-0 mt-30">
                                <h1 className="font-extralight text-[16px] opacity-70 mt-16">
                                    No results for &quot;{keyword}&quot;
                                </h1>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default Podcasts;
