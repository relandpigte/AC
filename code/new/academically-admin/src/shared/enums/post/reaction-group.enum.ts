import { PostType, ReactionType } from '@shared/service-proxies/service-proxies';

export enum ReactionGroup {
    Emotions = 'Emotions',
    Votes = 'Votes'
};

export const ReactionTypes: { [group in ReactionGroup]: ReactionType[] } = {
    [ReactionGroup.Emotions]: [ ReactionType.Like, ReactionType.Heart ],
    [ReactionGroup.Votes]: [ ReactionType.Upvote, ReactionType.Downvote ]
};

export const ReactionIcons: { [type in ReactionType]: string } = {
    [ReactionType.Like]: 'like',
    [ReactionType.Heart]: 'love',
    [ReactionType.Laugh]: 'like',
    [ReactionType.Wow]: 'like',
    [ReactionType.Sad]: 'sad',
    [ReactionType.Mad]: 'sad',
    [ReactionType.Upvote]: 'upvote',
    [ReactionType.Downvote]: 'downvote'
};

export const ReactionLabels: { [type in ReactionType]: string } = {
    [ReactionType.Like]: 'Generics.Reactions.Like',
    [ReactionType.Heart]: 'Generics.Reactions.Love',
    [ReactionType.Laugh]: 'Generics.Reactions.Haha',
    [ReactionType.Wow]: 'Generics.Reactions.Wow',
    [ReactionType.Sad]: 'Generics.Reactions.Sad',
    [ReactionType.Mad]: 'Generics.Reactions.Angry',
    [ReactionType.Upvote]: 'Generics.Reactions.Upvote',
    [ReactionType.Downvote]: 'Generics.Reactions.Downvote'
};

export const ReactionColorClass: { [type in ReactionType]: string } = {
    [ReactionType.Like]: 'blue',
    [ReactionType.Heart]: 'red',
    [ReactionType.Laugh]: 'blue',
    [ReactionType.Wow]: 'blue',
    [ReactionType.Sad]: 'yellow',
    [ReactionType.Mad]: 'yellow',
    [ReactionType.Upvote]: 'blue',
    [ReactionType.Downvote]: 'green'
};

export const PostTypeReactionGroup: { [type in PostType]: ReactionGroup } = {
    [PostType.Discussion]: ReactionGroup.Emotions,
    [PostType.Question]: ReactionGroup.Votes,
    [PostType.QuickPost]: ReactionGroup.Emotions,
    [PostType.Shared]: ReactionGroup.Emotions
};
