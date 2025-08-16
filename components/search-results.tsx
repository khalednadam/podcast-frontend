"use client";

import React from 'react'
import Podcasts from "@/components/podcasts";
import Episodes from "@/components/episodes";
import {usePodcastsStore} from "@/stores/podcasts-store";
import {Loader2} from "lucide-react";

const SearchResults = () => {
    const {isLoading, keyword} = usePodcastsStore()
    return (
        <div className={''}>
            {isLoading ?
                (
                    <div className="flex justify-center items-center absolute inset-0 mt-30">
                        <Loader2 className="animate-spin" width={50} height={50}/>
                    </div>
                ) : (
                     !keyword || keyword?.trim().length === 0 ?
                        (
                            <div className="flex justify-center items-center h-full">
                                <h1 className="font-extralight text-[16px] opacity-70 mt-16">
                                    Type in a search term to start.
                                </h1>
                            </div>
                        ) :
                        (
                            <>

                                <Podcasts/>
                                <Episodes/>
                            </>

                        )
                )}
        </div>
    )
}
export default SearchResults
