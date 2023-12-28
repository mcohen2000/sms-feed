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
      <td
        className="w-full min-w-[400px] px-4 py-3"
        title={post.text}
      >
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
