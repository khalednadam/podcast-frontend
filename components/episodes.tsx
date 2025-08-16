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
import {Episode} from "@/types/episode";
import GridCard from "@/components/episodeCards/grid-card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {DropdownMenuCheckboxItem} from "@radix-ui/react-dropdown-menu";
import ListCard from "@/components/episodeCards/list-card";

const Podcasts = () => {
    const {episodes, keyword, isLoading} = usePodcastsStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [layout, setLayout] = useState<"list" | "compact" | "grid" | "scroll">(
        () => {
            if (typeof window !== "undefined") {
                const stored = localStorage.getItem("layout");
                if (stored === "list" || stored === "compact" || stored === "grid" || stored === "scroll") {
                    return stored as "list" | "compact" | "grid" | "scroll";
                }
                return "compact";
            }
            return "compact";
        }
    );

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
    }, [episodes]);

    useEffect(() => {
        localStorage.setItem("layout", layout);
    }, [layout]);

    return (
        <>
            {keyword && (
                <>
                    <div
                        className="flex justify-between items-center border-b border-border sticky top-12 bg-background z-40 px-4 mt-12 py-1">
                        <h1 className="text-[16px] font-semibold ">
                            Top episodes for {keyword}
                        </h1>
                        <div className="flex items-center gap-2">
                            {layout === "scroll" &&
                                <div>
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
                                </div>
                            }

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div className={"cursor-pointer"}>
                                        <EllipsisVertical width={20} height={20}/>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className={'bg-gradient-to-t from-accent1 to-accent2 text-[14px]'}>
                                    {layout !== "scroll" && (
                                        <DropdownMenuCheckboxItem
                                            onCheckedChange={() => setLayout("scroll")}
                                            className={"cursor-pointer py-0 text-[14px]"}
                                        >
                                            Switch layout to Scroll
                                        </DropdownMenuCheckboxItem>
                                    )}
                                    {layout !== "grid" && (
                                        <DropdownMenuCheckboxItem
                                            onCheckedChange={() => setLayout("grid")}
                                            className={"cursor-pointer py-2 px-3 text-[14px]"}>
                                            Switch layout to Grid
                                        </DropdownMenuCheckboxItem>
                                    )}
                                    {layout !== "list" && (
                                        <DropdownMenuCheckboxItem
                                            onCheckedChange={() => setLayout("list")}
                                            className={"cursor-pointer py-2 px-3 text-[14px]"}>
                                            Switch layout to List
                                        </DropdownMenuCheckboxItem>
                                    )}
                                    {layout !== "compact" && (
                                        <DropdownMenuCheckboxItem
                                            onCheckedChange={() => setLayout("compact")}
                                            className={"cursor-pointer py-2 px-3 text-[14px]"}
                                        >
                                            Switch layout to Compact
                                        </DropdownMenuCheckboxItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="flex-1 flex gap-2 w-full overflow-y-scroll">
                        {episodes && episodes.length > 0 ? (
                            <div className="relative w-full mt-2 mb-40">
                                <div
                                    ref={scrollContainerRef}
                                    className={`px-4 overflow-x-auto overflow-y-hidden max-w-full grow relative scrollbar-hide
                                    ${
                                        layout === "grid"
                                            ? "grid gap-2 grid-cols-1 md:grid-cols-3"
                                            : layout === "scroll"
                                                ? "gap-2 inline-flex overflow-x-auto"
                                                : layout === "list"
                                                    ? "flex flex-col"
                                                    : layout === "compact"
                                                        ? "grid gap-2 grid-cols-1 md:grid-cols-3"
                                                        : "flex flex-col"
                                    }`}
                                    onScroll={checkScrollButtons}
                                >
                                    {episodes?.map((episode: Episode, index: number) =>
                                        layout === "compact" ? (
                                                <CompactCard key={index} episode={episode}/>
                                            ) :
                                            layout === "grid" ? (
                                                    <GridCard episode={episode} key={index}/>
                                                ) :
                                                layout === "scroll" ? (
                                                    <GridCard key={index} episode={episode}/>
                                                ) : layout === "list" ? (
                                                    <ListCard episode={episode} key={index}></ListCard>
                                                ) : (
                                                    <CompactCard episode={episode} key={index}></CompactCard>
                                                )
                                    )}
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
