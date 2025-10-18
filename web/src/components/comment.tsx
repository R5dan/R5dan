"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shadcn/avatar";
import { Card, CardContent } from "~/components/shadcn/card";
import { Heart, ThumbsDown, MessageCircle, Edit2, Trash2 } from "lucide-react";
import { Button } from "./shadcn/button";
import useToggle from "~/hooks/useToggle";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { toast } from "sonner";

/* ======================================================================
   Utilities & types
   - Defensive helpers to aPromiseable<void> runtime errors when `handle` is undefined/null.
   - Exported pure helpers so you can unit-test them easily.
   ====================================================================== */

/**
 * Returns a short initials string for a name, or `fallback` if name is falsy.
 * Examples: safeInitials('jane') => 'JA', safeInitials(undefined) => '??'
 */
export function safeInitials(name?: string | null, len = 2, fallback = "??") {
  if (!name || typeof name !== "string") return fallback;
  const trimmed = name.trim();
  if (trimmed.length === 0) return fallback;
  // Choose the first `len` non-space characters (simple and safe)
  const chars = Array.from(trimmed)
    .filter((c) => c !== " ")
    .slice(0, len)
    .join("");
  return (chars || fallback).toUpperCase();
}

/**
 * Returns a displayable handle string, or a fallback like 'unknown'.
 */
export function safeHandle(name?: string | null, fallback = "unknown") {
  return typeof name === "string" && name.trim().length > 0 ? name : fallback;
}

export type Comment<T extends string, R = Comment<T>> = {
  id: T;
  handle?: string; // optional at runtime
  avatarUrl?: string;
  content: string;
  likes?: number;
  dislikes?: number;
  createdAt?: string; // ISO date
  replyList?: R[];
  canEdit?: boolean;
  canDelete?: boolean;
};

export type CommentStateHandlers<ID> = {
  handleShowReplies?: (id: ID) => Promiseable<void>;
  handleToggleEditing?: (id: ID) => Promiseable<void>;
  handleEditContent?: (id: ID, content: string) => Promiseable<void>;
  handleSetEdit?: (id: ID, edit: boolean) => Promiseable<void>;
  handleToggleReplies?: (id: ID) => Promiseable<void>;
  handleSetReplyText?: (id: ID, text: string) => Promiseable<void>;
};

type CommentUserState = {
  isLiked?: boolean;
  isDisliked?: boolean;
};

export type CommentState = {
  editing?: boolean;
  editedContent?: string;
  showReplies?: boolean;
  replyText?: string;
  replies?: number;
};

type Promiseable<T> = T | Promise<T>;

type CommentEventHandlers<ID> = {
  handleAddReply?: (parent: ID, content: string) => Promiseable<void>;
  handleSaveEdit?: (id: ID, content: string) => Promiseable<void>;
  handleDelete?: (id: ID) => Promiseable<void>;
  handleToggleLike?: (id: ID) => Promiseable<void>;
  handleToggleDislike?: (id: ID) => Promiseable<void>;
};

export type CommentProps<T extends string> = Comment<T, P> &
  CommentEventHandlers<T> &
  CommentState & {
    ReplyJSX: React.JSXElementConstructor<T extends infer P ? P : never>;
  };

async function toComment(c: {
  data: Doc<"comments">;
  edits: Doc<"commentEdits">[];
}): Promise<Comment<Id<"comments">>> {
  "use server";

  const convexUser = await fetchQuery(api.user.getUser, {
    userId: c.data.user,
  });

  return {
    id: c.data._id,
    handle: c.data.user,
    avatarUrl: c.data.avatarUrl,
    content: c.edits[c.edits.length - 1]!.content,
    likes: c.data.likes,
    dislikes: c.data.dislikes,
    createdAt: c.data.createdAt,
    replyList: c.data.replyList,
    canEdit: c.data.user === c.edits[0]?._user,
    canDelete: c.data.user === c.edits[0]?._user,
  };
}

export function CommentBlogComponent({ id }: { id: string }) {}

export function CommentComponent({ id }: { id: Id<"comments"> }) {
  const [ip, setIp] = useState("");
  const [error, setError] = useState(false);
  const comment = useQuery(api.comments.getComment, { id });
  const replies = useQuery(api.comments.getCommentReplies, { comment: id });
  const { user: clerkUser } = useUser();
  const user = useQuery(api.user.getUserByClerkId, { clerkId: clerkUser?.id });

  useEffect(() => {
    if (error) return;
    fetch("/api/utils/ip")
      .then((r) => r.json())
      .then((r) => setIp(r.data))
      .catch((e) => {
        console.error(e);
        setIp("unknown");
        toast.error("Failed to fetch!");
        setError(true);
      });
  }, [error]);

  if (error) {
    return <h1>Error</h1>;
  }

  if (!comment) return <></>;
  if (!comment.data) return <></>;

  return (
    <CommentState
      id={id}
      content={
        comment.edits.sort((a, b) => a._creationTime - b._creationTime)?.at(0)
          ?.content ?? "Reply not found"
      }
      likes={(comment.data.likes ?? []).length}
      dislikes={(comment.data.dislikes ?? []).length}
      avatarUrl={clerkUser?.imageUrl ?? ""}
      createdAt={(comment.data._creationTime ?? Date.now()).toString()}
      handle={clerkUser?.username ?? "unknown"}
      canEdit={comment.data.user === user?._id}
      canDelete={comment.data.user === user?._id}
      replyList={replies!.map((r) => r.data._id)}
      handleAddReply={async (parent, content) => {
        "use server";
        if (!clerkUser || !user) {
          toast.error("Please login to add a comment");
          return;
        }

        await fetchMutation(api.comments.addComment, {
          parent,
          user: user._id,
          blog: comment.data!.blog,
          content,
        });
      }}
      handleDislikeChange={async (id, val) => {
        "use server";
        await fetchMutation(api.comments.dislikeComment, {
          comment: id,
          user: user?._id ?? ip,
          dislike: val,
        });
      }}
      handleLikeChange={async (id, val) => {
        "use server";
        await fetchMutation(api.comments.likeComment, {
          comment: id,
          user: user?._id ?? ip,
          like: val,
        });
      }}
      handleDelete={async (id) => {
        "use server";
        if (!clerkUser || !user) {
          toast.error("Please login to delete a comment");
          return;
        }

        if (user._id !== comment.data!.user && !user.admin) {
          toast.error("You can only delete your own comments");
          return;
        }
      }}
    />
  );
}

export function CommentState<T extends string = string>({
  handleDislikeChange = () => {
    return;
  },
  handleLikeChange = () => {
    return;
  },
  handleToggleLike: _DONT_USE,
  handleToggleDislike: __DONT_USE,
  ...props
}: Comment<T> &
  Omit<CommentEventHandlers<T>, "handleToggleLike" | "handleToggleDislike"> &
  CommentUserState & {
    handleDislikeChange?: (id: T, value: boolean) => Promiseable<void>;
    handleLikeChange?: (id: T, value: boolean) => Promiseable<void>;
  } & {
    handleToggleLike?: (id: T) => Promiseable<void>;
    handleToggleDislike?: (id: T) => Promiseable<void>;
  }) {
  const [editing, toggleEditing] = useToggle();
  const [showReplies, toggleShowReplies] = useToggle();
  const [replyText, setReplyText] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [liked, toggleLikedValue] = useToggle();
  const [disliked, toggleDislikedValue] = useToggle();

  function toggleDisliked(id: T) {
    if (id === props.id) {
      toggleDislikedValue();
      void handleDislikeChange(id, disliked);
    }
  }

  function toggleLiked(id: T) {
    if (id === props.id) {
      toggleLikedValue();
      void handleLikeChange(id, liked);
    }
  }

  return (
    <CommentUI<T>
      {...props}
      ReplyJSX={CommentState<T>}
      handleToggleEditing={(_) => {
        return toggleEditing();
      }}
      handleEditContent={(_, content) => {
        return setEditedContent(content);
      }}
      handleSetEdit={(_, value) => {
        return toggleEditing(value);
      }}
      handleToggleReplies={(_) => {
        return toggleShowReplies();
      }}
      handleSetReplyText={(_, text) => {
        return setReplyText(text);
      }}
      handleToggleDislike={(id) => {
        toggleDisliked(id);
      }}
      handleToggleLike={(id) => {
        toggleLiked(id);
      }}
      editing={editing}
      editedContent={editedContent}
      showReplies={showReplies}
      replyText={replyText}
      replies={props.replyList?.length ?? 0}
    />
  );
}

export function CommentUI<T extends string = string>({
  ReplyJSX,

  id,
  handle = "",
  avatarUrl = "",
  content = "",
  likes = 0,
  dislikes = 0,
  replies = 0,
  createdAt = Date.now().toString(),
  replyList = [],
  canEdit = false,
  canDelete = false,
  handleAddReply = (__, _) => {
    return;
  },
  handleSaveEdit = (_) => {
    return;
  },
  handleDelete = (_) => {
    return;
  },
  handleToggleLike = (_) => {
    return;
  },
  handleToggleDislike = (_) => {
    return;
  },
  handleToggleEditing = (_) => {
    return;
  },
  handleEditContent = (_) => {
    return;
  },
  handleSetEdit = (__, _) => {
    return;
  },
  handleToggleReplies = (__) => {
    return;
  },
  handleSetReplyText = (__, _) => {
    return;
  },

  editing = false,
  editedContent = "",
  isLiked = false,
  isDisliked = false,
  showReplies = false,
  replyText = "",
}: CommentProps<T> & CommentStateHandlers<T> & CommentUserState) {
  function readableDate(iso?: string) {
    if (!iso) return "just now";
    const date = new Date(iso);
    return date.toLocaleString();
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="flex gap-4 p-4">
        <div className="flex-shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={avatarUrl}
              alt={`${safeHandle(handle)}'s avatar`}
            />
            <AvatarFallback>{safeInitials(handle)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex w-full flex-col">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  {safeHandle(handle)}
                </span>
                <span className="text-muted-foreground text-xs">
                  • {readableDate(createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {canEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => void handleToggleEditing(id)}
                  aria-label="Edit comment"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {canDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => void handleDelete(id)}
                  aria-label="Delete comment"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="mt-2">
            {editing ? (
              <div className="flex flex-col gap-2">
                <textarea
                  className="w-full rounded-md border p-2 text-sm"
                  value={editedContent}
                  onChange={(e) => void handleEditContent(id, e.target.value)}
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => void handleSaveEdit(id, editedContent)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      void handleSetEdit(id, false);
                      void handleEditContent(id, content);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{editedContent}</p>
            )}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button
              aria-pressed={isLiked}
              aria-label="Like"
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm transition-all hover:bg-slate-100 ${
                isLiked ? "text-red-600" : "text-slate-600"
              }`}
              onClick={() => void handleToggleLike(id)}
            >
              <Heart className="h-4 w-4" />
              <span>{likes}</span>
            </button>

            <button
              aria-pressed={isDisliked}
              aria-label="Dislike"
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm transition-all hover:bg-slate-100 ${
                isDisliked ? "text-blue-600" : "text-slate-600"
              }`}
              onClick={() => void handleToggleDislike(id)}
            >
              <ThumbsDown className="h-4 w-4" />
              <span>{dislikes}</span>
            </button>

            <button
              aria-controls={`replies-${id}`}
              aria-expanded={showReplies}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-slate-600 transition-all hover:bg-slate-100"
              onClick={() => handleToggleReplies(id)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{replies}</span>
            </button>
          </div>

          {/* Replies section */}
          <div
            id={`replies-${id}`}
            className={`mt-3 ${showReplies ? "block" : "hidden"}`}
          >
            <div className="mb-2 grid grid-cols-1 gap-2">
              <div className="flex gap-2">
                <input
                  value={replyText}
                  onChange={(e) => void handleSetReplyText(id, e.target.value)}
                  placeholder="Write a reply..."
                  aria-label="Write a reply"
                />
                <Button onClick={() => void handleAddReply(id, replyText)}>
                  Reply
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {replyList.map((r) => (
                <ReplyJSX key={r.id} {...r} ReplyJSX={ReplyJSX} />
              ))}

              {(!replyList || replyList.length === 0) && (
                <div className="text-sm text-slate-500">
                  No replies yet — be the first to reply.
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
