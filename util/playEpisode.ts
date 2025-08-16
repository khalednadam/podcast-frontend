import {usePlayingStore} from "@/stores/playing-store";
import {Episode} from "@/types/episode";

export const playEpisode = (episode: Episode) => {
    usePlayingStore.setState({episode: episode});
    if (typeof window !== "undefined") {
        localStorage.setItem("playing-episode", JSON.stringify(episode));
    }
};
