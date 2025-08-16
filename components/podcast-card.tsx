import React, {useMemo} from "react";
import Image from "next/image";
import {Button} from "./ui/button";
import {EllipsisVertical, Play} from "lucide-react";
import Link from "next/link";
import {Podcast} from "@/types/podcast";
import {getGenreColor} from "@/util/getGenreColor";

const PodcastCard = ({podcast}: { podcast: Podcast }) => {
    return (
        <Link className="flex shrink-0 flex-col items-start justify-start pb-2 w-[200px] md:w-[227px] group" href={podcast.trackViewUrl} target={"_blank"}>
            <Image className="rounded-[3px]" src={podcast.artworkUrl600} alt={podcast.trackName} width={227}
                   height={268}/>
            <div className="flex flex-col flex-1 items-start justify-start ">
                <p className="group-hover:underline truncate !text-start max-w-[250px] text-[14px]">
                    {podcast.trackName}
                </p>
                <p className={`text-[12px]`} style={{color: getGenreColor(podcast.genres[0])}}>
                    {podcast.artistName}
                </p>
            </div>
        </Link>
    );
};

export default PodcastCard;
