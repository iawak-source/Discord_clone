import { useEffect, useState } from "react";

type ChatScrollProps = {
    chatRef: React.RefObject<HTMLDivElement | null>;
    bottomRef: React.RefObject<HTMLDivElement | null>;
    shouldLoadMore: boolean;
    loadMore: () => void;
    count: number;
};

export const useChatScroll = ({
    chatRef,
    bottomRef,
    shouldLoadMore,
    loadMore,
    count,
}: ChatScrollProps) => {
    const [hasInitialized, setHasInitialized] = useState(false);

    // Infinite Scroll để load message cũ khi scroll lên trên
    useEffect(() => {
        const topDiv = chatRef.current;
        if (!topDiv) return;

        const handleScroll = () => {
            const scrollTop = topDiv.scrollTop;
            if (scrollTop === 0 && shouldLoadMore) {
                loadMore();
            }
        };

        topDiv.addEventListener("scroll", handleScroll);
        return () => {
            topDiv.removeEventListener("scroll", handleScroll);
        };
    }, [chatRef, shouldLoadMore, loadMore]);

    // Auto scroll xuống dưới khi có tin nhắn mới
    useEffect(() => {
        const bottomDiv = bottomRef.current;
        const topDiv = chatRef.current;

        const shouldAutoScroll = () => {
            if (!hasInitialized && bottomDiv) {
                setHasInitialized(true);
                return true;
            }

            if (!topDiv) return false;

            const distanceFromBottom =
                topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

            return distanceFromBottom <= 150; // cho phép chênh lệch nhỏ
        };

        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 50);
        }
    }, [chatRef, bottomRef, count, hasInitialized]);
};
