import React, {useMemo} from "react";
import Image from "next/image";
import {Button} from "../ui/button";
import {EllipsisVertical, Play} from "lucide-react";
import Link from "next/link";
import {Episode} from "@/types/episode";
import DemoDialog from "@/components/demo-dialog";
import {usePlayingStore} from "@/stores/playing-store";
import {getGenreColor} from "@/util/getGenreColor";
import {playEpisode} from "@/util/playEpisode";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

const CompactCard = ({episode}: { episode: Episode }) => {
    const {episode: playingEpisode} = usePlayingStore();
    const isPlaying = playingEpisode?.trackId === episode.trackId;

    return (
        <div
            className="border-b border-border flex items-center pb-2 group cursor-pointer"
            onClick={() => playEpisode(episode)}
        >
            <div className="relative  w-[50px]">
                {isPlaying && (
                    <div
                        className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/40 rounded-[5px]">
                        <div className="relative w-6 h-6 z-10 flex items-end justify-center space-x-0.5">
                            <div className="w-0.5 bg-white rounded-full animate-sound-wave-1"
                                 style={{height: '60%'}}></div>
                            <div className="w-0.5 bg-white rounded-full animate-sound-wave-2"
                                 style={{height: '80%'}}></div>
                            <div className="w-0.5 bg-white rounded-full animate-sound-wave-3"
                                 style={{height: '40%'}}></div>
                            <div className="w-0.5 bg-white rounded-full animate-sound-wave-4"
                                 style={{height: '100%'}}></div>
                            <div className="w-0.5 bg-white rounded-full animate-sound-wave-5"
                                 style={{height: '70%'}}></div>
                        </div>
                    </div>
                )}

                <div className={`absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center opacity-0  transition-opacity duration-300
          ${!isPlaying ? 'group-hover:opacity-100' : 'opacity-0'}`}>
                    <Play fill={'white'} className="text-white"/>
                </div>
                <Image
                    className="rounded min-w-[50px] min-h-[50px] w-[50px] h-[50px]"
                    src={episode.artworkUrl600}
                    alt={episode.trackName}
                    width={50}
                    height={50}
                />
            </div>
            <div className="flex flex-col w-full truncate">
                <Tooltip>
                    <TooltipTrigger className="text-start w-full">
                        <h2 className="mx-2.5 hover:underline truncate w-full">
                            {episode.trackName}
                        </h2>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{episode.trackName}</p>
                    </TooltipContent>
                </Tooltip>

                {episode.trackViewUrl ? (
                    <Link
                        href={episode?.trackViewUrl || ""}
                        className="w-max max-w-[250px]"
                        target="_blank"
                    >
                        <p
                            className="mx-2.5 truncate  text-[12px] hover:underline"
                            style={{color: getGenreColor(episode.genres[0].name)}}
                        >
                            {episode.collectionName}
                        </p>
                    </Link>
                ) : (
                    <p
                        className="mx-2.5 text-[12px] hover:underline truncate max-w-md"
                        style={{color: getGenreColor(episode.genres[0].name)}}
                    >
                        {episode.collectionName}
                    </p>
                )}
            </div>
            <div className={'flex w-[50px]'}>
                <DemoDialog>
                    <Button variant={"ghost"} size={"icon"}>
                        <EllipsisVertical/>
                    </Button>
                </DemoDialog>
            </div>
        </div>
    );
};

export default CompactCard;
