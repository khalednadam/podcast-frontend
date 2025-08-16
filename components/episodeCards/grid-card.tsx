import React, {useMemo} from "react";
import {Episode} from "@/types/episode";
import {EllipsisVertical, Play} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import DemoDialog from "@/components/demo-dialog";
import {getGenreColor} from "@/util/getGenreColor";
import {usePlayingStore} from "@/stores/playing-store";
import {playEpisode} from "@/util/playEpisode";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

const GridCard = ({episode}: { episode: Episode }) => {
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
            className="flex items-start cursor-pointer transition-all duration-150 rounded-[5px] overflow-clip relative min-w-[388px]"
            style={{
                background: `linear-gradient(to bottom, ${genreColor}20, ${genreColor}10)`,
            }}
            onMouseOver={(e) =>
                (e.currentTarget.style.background = `linear-gradient(to bottom, ${genreColor}30, ${genreColor}20)`)
            }
            onMouseOut={(e) =>
                (e.currentTarget.style.background = `linear-gradient(to bottom, ${genreColor}20, ${genreColor}10)`)
            }
        >
            <div className="relative group">
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
                    <Play className="text-white"/>
                </div>
                <Image
                    className="min-w-[110px] min-h-[110px]"
                    src={episode.artworkUrl600}
                    alt={episode.trackName}
                    width={110}
                    height={110}
                />
            </div>
            <div className="flex flex-col justify-between items-start h-full py-2 max-w-[260px] mx-2.5">
                <div className="">
                    {episode.trackViewUrl ? (
                        <Link
                            href={episode?.trackViewUrl || ""}
                            className="w-max !max-w-[250px]"
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
                            className="text-[12px] max-w-[250px] hover:underline truncate"
                            style={{color: genreColor}}
                        >
                            {episode.collectionName}
                        </p>
                    )}

                    <Tooltip>
                        <TooltipTrigger>
                            <Link href={episode.trackViewUrl} className="w-max" target="_blank">
                                <h2 className="hover:underline truncate max-w-[250px] text-[14px]">
                                    {episode.trackName}
                                </h2>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{episode.trackName}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
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
            <div className="absolute top-0 right-0">
                <DemoDialog>
                    <Button variant={"ghost"} size={"icon"}>
                        <EllipsisVertical/>
                    </Button>
                </DemoDialog>
            </div>
        </div>
    )
        ;
};
export default GridCard;
