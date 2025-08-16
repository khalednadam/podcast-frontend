"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  MoveRightIcon,
  MoveLeftIcon,
  Volume1,
  Plus,
  Minus,
  Square,
} from "lucide-react";
import type { Episode } from "@/types/episode";
import { usePlayingStore } from "@/stores/playing-store";
import { getGenreColor } from "@/util/getGenreColor";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AudioPlayerProps {
  episode?: Episode | null;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onSkipBack?: () => void;
  onSkipForward?: () => void;
  onSeek?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  isPlaying: externalIsPlaying,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  onSeek,
  onVolumeChange,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { episode } = usePlayingStore();
  const genreColor = getGenreColor(episode?.genres[0].name || "");

  const isPlaying =
    externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;

  useEffect(() => {
    const storedCurrentTime =
      parseInt(localStorage.getItem("currentTime") as string) || 0;
    const storedVolume =
      parseFloat(localStorage.getItem("volume") as string) || 0.8;
    const storedPlaybackSpeed =
      parseFloat(localStorage.getItem("playbackSpeed") as string) || 1;

    setCurrentTime(storedCurrentTime);
    setVolume(storedVolume);
    setPlaybackSpeed(storedPlaybackSpeed);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (currentTime > 0) {
      localStorage.setItem("currentTime", currentTime.toString());
    }
  }, [currentTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentTime > 0) {
      const handleCanPlay = () => {
        audio.currentTime = currentTime;
        audio.removeEventListener("canplay", handleCanPlay);
      };
      audio.addEventListener("canplay", handleCanPlay);
      return () => audio.removeEventListener("canplay", handleCanPlay);
    }
  }, []);

  useEffect(() => {
    if (episode && audioRef.current) {
      console.log("Episode changed, setting loading to true");
      setIsLoading(true);
      setInternalIsPlaying(false);
      audioRef.current.load();
    }
  }, [episode?.episodeUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      console.log("Audio loadstart - setting loading to true");
      setIsLoading(true);
    };
    
    const handleCanPlay = () => {
      console.log("Audio canplay - setting loading to false");
      setIsLoading(false);
      if (episode && !localStorage.getItem(`episode_${episode.episodeGuid}_paused`)) {
        audio.play().then(() => {
          setInternalIsPlaying(true);
        }).catch((error) => {
          console.error("Error auto-playing:", error);
          setInternalIsPlaying(false);
        });
      }
    };
    
    const handleEnded = () => {
      setInternalIsPlaying(false);
      setIsLoading(false);
    };
    
    const handleError = () => {
      setInternalIsPlaying(false);
      setIsLoading(false);
    };

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [episode]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const clickTime = (clickX / width) * duration;
      audioRef.current.currentTime = clickTime;
      setCurrentTime(clickTime);
      localStorage.setItem("currentTime", clickTime.toString());
      onSeek?.(clickTime);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !progressRef.current || !audioRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = Math.max(
      0,
      Math.min(duration, (mouseX / width) * duration)
    );

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    localStorage.setItem("currentTime", newTime.toString());
    onSeek?.(newTime);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, duration]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (audioRef.current && episode) {
      if (isPlaying) {
        audioRef.current.pause();
        setInternalIsPlaying(false);
        localStorage.setItem(`episode_${episode.episodeGuid}_playing`, "false");
        localStorage.setItem(`episode_${episode.episodeGuid}_paused`, "true");
      } else {
        setIsLoading(true);
        audioRef.current.play().then(() => {
          setInternalIsPlaying(true);
          setIsLoading(false);
          localStorage.setItem(`episode_${episode.episodeGuid}_playing`, "true");
          localStorage.removeItem(`episode_${episode.episodeGuid}_paused`);
        }).catch((error) => {
          console.error("Error playing audio:", error);
          setIsLoading(false);
          setInternalIsPlaying(false);
        });
      }
    }

    onPlayPause?.();
  };

  const raiseVolume = () => {
    if (volume < 1) {
      const newVolume = Math.min(1, volume + 0.1);
      setVolume(newVolume);
      localStorage.setItem("volume", newVolume.toString());
    }
  };

  const lowerVolume = () => {
    if (volume > 0) {
      const newVolume = Math.max(0, volume - 0.1);
      setVolume(newVolume);
      localStorage.setItem("volume", newVolume.toString());
    }
  };

  const faster = () => {
    if (playbackSpeed < 2) {
      const newSpeed = Math.min(playbackSpeed + 0.25, 2);
      setPlaybackSpeed(newSpeed);
      localStorage.setItem("playbackSpeed", newSpeed.toString());
    }
  };

  const slower = () => {
    if (playbackSpeed > 0.25) {
      const newSpeed = Math.max(playbackSpeed - 0.25, 0.25);
      setPlaybackSpeed(newSpeed);
      localStorage.setItem("playbackSpeed", newSpeed.toString());
    }
  };

  const stop = () => {
    if (episode) {
      localStorage.removeItem(`episode_${episode.episodeGuid}_playing`);
    }
    usePlayingStore.setState({ episode: undefined });
  };

  const handleSkipBack = () => {
    if (audioRef.current) {
      const newTime = Math.max(0, audioRef.current.currentTime - 15);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      localStorage.setItem("currentTime", newTime.toString());
    }
    onSkipBack?.();
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      const newTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 15
      );
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      localStorage.setItem("currentTime", newTime.toString());
    }
    onSkipForward?.();
  };

  if (!episode) {
    return null;
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={episode.episodeUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        style={{ display: "none" }}
      />

      <div
        className={
          "fixed bottom-2 right-3 z-50 border-t border-border shadow-lg transition-all duration-300  w-full md:w-[calc(100%-246px)] rounded bg-background overflow-hidden"
        }
      >
        <div
          className="container mx-auto h-full flex items-center justify-between gap-2 "
          style={{
            background: `linear-gradient(to bottom, ${genreColor}20, ${genreColor}10)`,
          }}
        >
          <div className="flex items-center mb-0">
            <Image
              src={episode.artworkUrl160}
              alt={episode.trackName}
              width={80}
              height={80}
              className="object-cover flex-shrink-0 mr-[10px]"
            />
            <div className="min-w-0 max-w-[120px]">
              <p
                className={"uppercase text-[10px] pb-[2px] font-bold"}
                style={{ fontFamily: "var(--font-gtamerica)" }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    loading
                  </span>
                ) : isPlaying ? "playing" : "paused"}
              </p>
              <h4 className="font-medium text-sm truncate">
                {episode.trackName}
              </h4>
              <Link href={episode.collectionViewUrl}>
                <p
                  className="text-xs text-muted-foreground truncate"
                  style={{ color: genreColor }}
                >
                  {episode.collectionName} 
                </p>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-y-2 flex-1">
            <div className="flex items-center space-x-1">
              <Button
                variant={"ghost"}
                onClick={handleSkipBack}
                size={"sm"}
                disabled={isLoading}
                className="p-2 hover:bg-accent rounded transition-colors flex justify-center items-center gap-1"
                aria-label="Skip back 15 seconds"
              >
                <MoveLeftIcon width={12} height={12} />
                <p
                  className={"text-xs"}
                  style={{ fontFamily: "var(--font-sfMono)" }}
                >
                  15
                </p>
              </Button>

              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={handlePlayPause}
                disabled={isLoading}
                className="p-3 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isLoading ? (
                  <Play
                    fill={"white"}
                    className="w-5 h-5 text-primary-foreground ml-0.5 animate-pulse"
                  />
                ) : isPlaying ? (
                  <Pause
                    fill={"white"}
                    className="w-5 h-5 text-primary-foreground"
                  />
                ) : (
                  <Play
                    fill={"white"}
                    className={`w-5 h-5 text-primary-foreground ml-0.5 ${isLoading ? "animate-pulse" : ""}`}
                  />
                )}
              </Button>

              <Button
                variant={"ghost"}
                onClick={handleSkipForward}
                size={"sm"}
                disabled={isLoading}
                className="p-2 hover:bg-accent rounded transition-colors flex justify-center items-center gap-1"
                aria-label="Skip back 15 seconds"
              >
                <p
                  className={"text-xs"}
                  style={{ fontFamily: "var(--font-sfMono)" }}
                >
                  15
                </p>
                <MoveRightIcon width={12} height={12} />
              </Button>
            </div>

            <div className="gap-y-2 flex flex-col items-center justify-center flex-1 mx-auto">
              <div
                ref={progressRef}
                className="h-[5px] bg-white rounded-full cursor-pointer relative flex w-[95%] mx-auto"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full w-full rounded-full transition-all duration-100"
                  style={{
                    width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                    backgroundColor: genreColor,
                  }}
                />
                <div
                  className="absolute top-1/2 w-3 h-3 rounded-full shadow-md cursor-grab hover:scale-110 transition-transform duration-200 active:cursor-grabbing"
                  style={{
                    left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                    backgroundColor: genreColor,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseDown={handleMouseDown}
                />
              </div>
              <div className="flex justify-between w-[95%]">
                <span
                  className="text-xs text-muted-foreground w-12 text-left"
                  style={{ fontFamily: "var(--font-sfMono)" }}
                >
                  {formatTime(currentTime)}
                </span>
                <span
                  className="text-xs text-muted-foreground w-12 text-right"
                  style={{ fontFamily: "var(--font-sfMono)" }}
                >
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 h-[80px] min-w-[50px] border-l  border-white/20">
            <div
              className={
                "flex justify-between items-center space-x-2 border-b border-white/20 px-2"
              }
            >
              <Volume1
                fill={"white"}
                width={15}
                onClick={() => lowerVolume()}
                className={"cursor-pointer"}
              />
              <p
                className={"text-xs w-[30px] text-center select-none"}
                style={{ fontFamily: "var(--font-sfMono)" }}
              >
                {Math.floor(volume * 100)}%
              </p>
              <Volume2
                fill={"white"}
                width={15}
                onClick={() => raiseVolume()}
                className={"cursor-pointer"}
              />
            </div>
            <div
              className={
                "flex justify-between items-center space-x-2 border-b border-white/20 px-2"
              }
            >
              <Minus
                width={15}
                onClick={() => slower()}
                className={"cursor-pointer"}
              />
              <p
                className={"text-xs w-[30px] text-center select-none"}
                style={{ fontFamily: "var(--font-sfMono)" }}
              >
                {playbackSpeed}%
              </p>
              <Plus
                width={15}
                onClick={() => faster()}
                className={"cursor-pointer"}
              />
            </div>
            <div
              className={
                "flex justify-start items-center space-x-2 px-2 cursor-pointer select-none"
              }
              onClick={() => stop()}
            >
              <Square fill={"white"} width={15} className={"cursor-pointer"} />
              <p
                className={"text-xs w-[30px] uppercase !select-none"}
                style={{ fontFamily: "var(--font-sfMono)" }}
              >
                Stop
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
