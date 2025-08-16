"use client";

import React, {useRef, useState} from "react";
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

const PodcastsScroll = ({podcasts, keyword}: { podcasts: Podcast[] | null, keyword: string }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

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

    React.useEffect(() => {
        checkScrollButtons();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", checkScrollButtons);
            return () => container.removeEventListener("scroll", checkScrollButtons);
        }
    }, [podcasts]);

    return (
        <>
            <div
                className="flex justify-between items-center border-b border-border sticky top-12 bg-background z-40 px-4 mt-12 mb-[10px]">
                <h1 className="text-[16px] font-semibold ">
                    Top podcasts for {keyword}
                </h1>
                <div className="flex items-center gap-2">
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
                    <Button size={"icon"} variant={"ghost"}>
                        <EllipsisVertical/>
                    </Button>
                </div>
            </div>
            <div className="flex-1 flex gap-2 w-full overflow-y-scroll ">
                {podcasts && podcasts.length > 0 ? (
                    <div className="relative w-full mt-2">
                        <div
                            ref={scrollContainerRef}
                            className={`px-4 gap-2 w-full overflow-x-auto overflow-y-hidden max-w-full grow relative scrollbar-hide`}
                            
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


    );
};

export default PodcastsScroll;
