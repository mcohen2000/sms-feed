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
        {post.OutboundWebhook[
          post.OutboundWebhook.length - 1
        ]?.createdAt.toLocaleString()}
      </td>
      <td
        className="w-[400px] min-w-[400px] max-w-[400px] truncate px-4 py-3"
        title={post.text}
      >
        {post.text}
      </td>
      <td className="w-[100px] min-w-[100px] max-w-[100px] px-4 py-3">
        {post.OutboundWebhook.some(item => item.smsStatus ===
        "scheduled") ? (
          <>
            Scheduled
            <button className="text-blue-500 underline"
                onClick={() => cancelScheduled.mutate({postId: post.id})}
            >Cancel</button>
          </>
        ) : post.OutboundWebhook.some(item => item.smsStatus ===
            "delivered") ? "Delivered" : (
          `${post.OutboundWebhook[post.OutboundWebhook.length - 1]?.smsStatus
            .charAt(0)
            .toUpperCase()}${post.OutboundWebhook[
            post.OutboundWebhook.length - 1
          ]?.smsStatus.substring(1)}`
        )}
      </td>
      <td className="w-[100px] min-w-[100px] max-w-[100px] px-4 py-3">
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
