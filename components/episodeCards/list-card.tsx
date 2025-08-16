import React, {useMemo} from "react";
import {EllipsisVertical, Play} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Episode} from "@/types/episode";
import DemoDialog from "@/components/demo-dialog";
import {getGenreColor} from "@/util/getGenreColor";
import {playEpisode} from "@/util/playEpisode";
import {usePlayingStore} from "@/stores/playing-store";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

const ListCard = ({episode}: { episode: Episode }) => {
    const {episode: playingEpisode} = usePlayingStore();
    const isPlaying = playingEpisode?.trackId === episode.trackId;
    const calcTime = () => {
        const minutes = Math.floor(episode.trackTimeMillis / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours > 0) {
            return `${hours}hr${remainingMinutes}min`;
        }
        return `${minutes}min`;
    };

    const genreColor = getGenreColor(episode.genres[0].name);

    return (
        <div
            onClick={() => playEpisode(episode)}
            className="flex w-full  items-start cursor-pointer transition-all duration-150 overflow-clip relative min-w-[388px] group hover:bg-black/20 py-2 border-b border-border"
        >
            <div className="relative flex">
                {isPlaying && (
                    <div
                        className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/40 rounded-[5px]">
                        <div className="relative w-6 h-6 z-10 flex items-end justify-center space-x-0.5">
                            <div
                                className="w-0.5 bg-white rounded-full animate-sound-wave-1"
                                style={{height: "60%"}}
                            ></div>
                            <div
                                className="w-0.5 bg-white rounded-full animate-sound-wave-2"
                                style={{height: "80%"}}
                            ></div>
                            <div
                                className="w-0.5 bg-white rounded-full animate-sound-wave-3"
                                style={{height: "40%"}}
                            ></div>
                            <div
                                className="w-0.5 bg-white rounded-full animate-sound-wave-4"
                                style={{height: "100%"}}
                            ></div>
                            <div
                                className="w-0.5 bg-white rounded-full animate-sound-wave-5"
                                style={{height: "70%"}}
                            ></div>
                        </div>
                    </div>
                )}
                <div
                    className={`absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center opacity-0 transition-opacity duration-300
          ${!isPlaying ? "group-hover:opacity-100" : "opacity-0"}`}
                >
                    <Play fill={'white'} className="text-white"/>
                </div>
                <Image
                    className="min-w-[100px] min-h-[100px]"
                    src={episode.artworkUrl600}
                    alt={episode.trackName}
                    width={100}
                    height={100}
                />
            </div>
            <div className="flex flex-col p-[5px] w-[85%] h-[100px] items-start py-2 mx-2.5  justify-between">
                <div>
                    <Tooltip>
                        <TooltipTrigger className="text-start">
                            <Link
                                href={episode.trackViewUrl}
                                className="max-w-[90%]"
                                target="_blank"
                            >
                                <h2 className="hover:underline truncate max-w-[100%] text-[14px]">
                                    {episode.trackName}
                                </h2>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{episode.trackName}</p>
                        </TooltipContent>
                    </Tooltip>

                    {episode.trackViewUrl ? (
                        <Link
                            href={episode?.trackViewUrl || ""}
                            className="w-max !max-w-[250px] flex-1"
                            target="_blank"
                        >
                            <p
                                className=" truncate max-w-[250px] text-[12px] hover:underline"
                                style={{color: genreColor}}
                            >
                                {episode.collectionName}
                            </p>
                        </Link>
                    ) : (
                        <p
                            className="text-[12px] max-w-[250px] hover:underline truncate flex-1"
                            style={{color: genreColor}}
                        >
                            {episode.collectionName}
                        </p>
                    )}
                </div>

                {episode.description && episode.description !== "null" && (
                    <p
                        className={
                            "line-clamp-2 truncate max-w-[90%] overflow-hidden text-[14px] text-description"
                        }
                    >
                        {episode.description}
                    </p>
                )}
                <div className="flex items-center gap-1 text-info">
                    <p className="text-[12px]">
                        {new Date(episode.releaseDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })}
                    </p>
                    <p className="text-[12px]">{calcTime()}</p>
                </div>
            </div>
            <div className="!top-0 !bottom-0 right-0 h-full flex-1 flex justify-center items-center absolute">
                <div className={"flex flex-col justify-center items-center"}>
                    <Button variant={"ghost"} size={"icon"} onClick={() => playEpisode(episode)}>
                        <Play fill={'white'} className="text-white"/>
                    </Button>
                    <DemoDialog>
                        <Button variant={"ghost"} size={"icon"}>
                            <EllipsisVertical/>
                        </Button>
                    </DemoDialog>
                </div>
            </div>
        </div>
    );
};
export default ListCard;
