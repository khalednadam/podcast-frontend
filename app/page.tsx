import React from "react";
import SearchResults from "@/components/search-results";
import AudioPlayer from "@/components/audio-player";

export default function Home() {
    return (
        <div className={""}>
            <div
                className={
                    "left-0 bg-gradient-to-r from-[hsla(238,27%,12%,1)] to-[hsla(238,27%,12%,0)] absolute top-0 bottom-[15px] w-[20px] z-50"
                }
            ></div>
            <SearchResults/>
            <AudioPlayer/>
            <div
                className={
                    "right-0 bg-gradient-to-l from-[hsla(238,27%,12%,1)] to-[hsla(238,27%,12%,0)] absolute top-0 bottom-[15px] w-[20px] z-50"
                }
            ></div>
        </div>
    );
}
