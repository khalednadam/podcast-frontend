import {create} from "zustand";
import {Episode} from "@/types/episode";

export const usePlayingStore = create<{
    episode: Episode | null;
    setEpisode: (episode: Episode) => void;
}>((set) => ({
    episode: null,

    setEpisode: (episode: Episode) => {
        set({episode: episode});
        if (typeof window !== "undefined") {
            localStorage.setItem("playing-episode", JSON.stringify(episode));
        }
    },
}));

if (typeof window !== "undefined") {
    const storedEpisode = localStorage.getItem("playing-episode");
    if (storedEpisode) {
        try {
            const episode = JSON.parse(storedEpisode);
            usePlayingStore.setState({ episode });
        } catch (error) {
            console.error("Error parsing stored episode:", error);
        }
    }
}
