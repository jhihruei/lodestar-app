export declare type PodcastProgramBriefProps = {
    id: string;
    coverUrl: string | null;
    title: string;
    listPrice: number;
    salePrice: number | null;
    soldAt: Date | null;
    duration: number;
    durationSecond: number;
    description: string | null;
    categories: {
        id: string;
        name: string;
    }[];
    instructor: {
        id: string;
        avatarUrl: string | null;
        name: string;
    } | null;
    isEnrolled?: boolean;
    isSubscribed?: boolean;
};
export declare type PodcastProgramContent = {
    id: string;
    title: string;
    abstract: string | null;
    description: string | null;
    coverUrl: string | null;
    publishedAt: Date;
    categories: {
        id: string;
        name: string;
    }[];
    tags: string[];
    url: string;
    instructorIds: string[];
};
export declare type PlaylistProps = {
    id: string;
    title: string;
    maxPosition: number;
};
export declare type PodcastProgramContentProps = {
    id: string;
    coverUrl: string | null;
    title: string;
    duration: number;
    durationSecond: number;
    instructor: {
        id: string;
        avatarUrl: string | null;
        name: string;
    };
};
