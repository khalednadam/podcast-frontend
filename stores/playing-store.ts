import {create} from "zustand";
import {Episode} from "@/types/episode";

export const usePlayingStore = create<{
    episode: Episode | null;
    setEpisode: (episode: Episode) => void;
}>((set) => ({
    episode:
        JSON.parse(
            typeof window !== "undefined"
                ? (localStorage.getItem("playing-episode") as string)
                : "null"
        ) || null,
    setEpisode: (episode: Episode) => {
        set({episode: episode});
        if (typeof window !== undefined) {
            localStorage.setItem("playing-episode", JSON.stringify(episode));
        }
    },
}));
