"use client";
import { Prisma } from "@prisma/client";
import { api } from "~/trpc/react";
import { countCharacters } from "../_utils/countCharacters";
import { useRouter } from "next/navigation";
type PostWithSent = Prisma.PostGetPayload<{
  include: { OutboundWebhook: true };
}>;

export default function PostQueueItem(props: { post: PostWithSent }) {
  const post = props.post;
  const router = useRouter();
  const cancelScheduled = api.post.cancelScheduled.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <tr className="border-b">
      <td className="w-[100px] min-w-[100px] px-4 py-3">
        {post.sendDate?.toLocaleString()}
      </td>
      <td className="w-full min-w-[400px] px-4 py-3" title={post.text}>
        <span className="line-clamp-3">
          {post.text.includes("\n")
            ? post.text.split("\n").map((text, index) =>
                index === post.text.split("\n").length - 1 ? (
                  <span key={index}>{text}</span>
                ) : (
                  <span key={index}>
                    {text}
                    <br />
                  </span>
                ),
              )
            : post.text}
        </span>
      </td>
      <td className="w-[130px] min-w-[130px] max-w-[130px] px-4 py-3">
        {post.OutboundWebhook.some((item) => item.smsStatus === "scheduled") ? (
          <>
            <span className="rounded-lg bg-yellow-400 px-2 py-1 text-yellow-900">
              Scheduled
            </span>
            <button
              className="mt-2 text-blue-500 underline"
              onClick={() => cancelScheduled.mutate({ postId: post.id })}
            >
              Cancel
            </button>
          </>
        ) : post.OutboundWebhook.some(
            (item) => item.smsStatus === "delivered",
          ) ? (
          <span className="rounded-lg bg-green-400 px-2 py-1 text-green-900">
            Delivered
          </span>
        ) : post.OutboundWebhook.some(
            (item) => item.smsStatus === "canceled",
          ) ? (
          <span className="rounded-lg bg-red-400 px-2 py-1 text-red-900">
            Canceled
          </span>
        ) : (
          <span className="rounded-lg bg-gray-400 px-2 py-1 text-gray-900">
            {`${post.OutboundWebhook[post.OutboundWebhook.length - 1]?.smsStatus
              .charAt(0)
              .toUpperCase()}${post.OutboundWebhook[
              post.OutboundWebhook.length - 1
            ]?.smsStatus.substring(1)}`}
          </span>
        )}
      </td>
      <td className="w-[130px] min-w-[130px] max-w-[130px] px-4 py-3">
        {
          post.OutboundWebhook.filter((item) => item.smsStatus === "delivered")
            .length
        }
        /
        {
          post.OutboundWebhook.filter((item) => item.smsStatus !== "canceled")
            .length
        }
      </td>
    </tr>
  );
}
