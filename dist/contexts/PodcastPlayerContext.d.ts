import React from 'react';
import { PodcastProgramContent } from '../types/podcast';
declare type PlaylistContentProps = {
    id: string | null;
    podcastProgramIds: string[];
    currentIndex: number;
    isPreview?: boolean;
};
export declare type PlaylistModeType = 'loop' | 'single-loop' | 'random';
declare type PodcastPlayerProps = {
    visible: boolean;
    isPlaying: boolean;
    maxDuration: number;
    playlist: PlaylistContentProps | null;
    playlistMode: PlaylistModeType;
    currentPlayingId: string;
    currentPodcastProgram: PodcastProgramContent | null;
    loadingPodcastProgram: boolean;
    togglePlaylistMode?: () => void;
    setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
    setPlaylist?: (playlist: PlaylistContentProps) => void;
    setupPlaylist?: (playlist: PlaylistContentProps) => void;
    playNow?: (playlist: PlaylistContentProps) => void;
    shift?: (quantity: 1 | -1) => void;
    closePlayer?: () => void;
    setMaxDuration?: React.Dispatch<React.SetStateAction<number>>;
};
declare const PodcastPlayerContext: React.Context<PodcastPlayerProps>;
export declare const PodcastPlayerProvider: React.FC;
export default PodcastPlayerContext;
