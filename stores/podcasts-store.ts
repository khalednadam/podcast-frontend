import {Podcast} from "@/types/podcast";
import {create} from "zustand";
import {Episode} from "@/types/episode";

export const usePodcastsStore = create<{
    podcasts: Podcast[] | null;
    setPodcasts: (podcasts: Podcast[]) => void;
    episodes: Episode[] | null;
    setEpisodes: (podcasts: Episode[]) => void;
    keyword: string | null;
    isLoading: boolean;
    setKeyword: (word: string) => void;
    setIsLoading: (loading: boolean) => void;
}>((set) => ({
    podcasts: null,
    setPodcasts: (podcasts: Podcast[]) => set({podcasts: podcasts}),
    episodes: null,
    setEpisodes: (episodes: Episode[]) => set({episodes: episodes}),
    keyword: null,
    isLoading: false,
    setKeyword: (word: string) => set({keyword: word}),
    setIsLoading: (loading: boolean) => set({isLoading: loading})
}));
