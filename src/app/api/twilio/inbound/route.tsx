import { NextRequest, NextResponse } from "next/server";
import { api } from "~/trpc/server";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const toCountry = data.get("ToCountry")?.toString() || "";
  const toState = data.get("ToState")?.toString() || "";
  const numMedia = data.get("NumMedia")?.toString() || "";
  const toCity = data.get("ToCity")?.toString() || "";
  const fromZip = data.get("FromZip")?.toString() || "";
  const smsSid = data.get("MessageSid")?.toString() || "";
  const optOutType = data.get("OptOutType")?.toString() || "";
  const fromState = data.get("FromState")?.toString() || "";
  const status = data.get("SmsStatus")?.toString() || "";
  const fromCity = data.get("FromCity")?.toString() || "";
  const body = data.get("Body")?.toString() || "";
  const from = data.get("From")?.toString() || "";
  const to = data.get("To")?.toString() || "";
  const toZip = data.get("ToZip")?.toString() || "";
  const numSegments = data.get("NumSegments")?.toString() || "";

  // create InboundWebHook & handle Subscriber OptOut
  const newInboundWebhook = api.post.handleInboundWebhook.mutate({
    toCountry: toCountry,
    toState: toState,
    numMedia: parseInt(numMedia),
    toCity: toCity,
    fromZip: fromZip,
    smsSid: smsSid,
    optOutType: optOutType,
    fromState: fromState,
    status: status,
    fromCity: fromCity,
    body: body,
    from: from,
    to: to,
    toZip: toZip,
    numSegments: parseInt(numSegments),
  });
  return NextResponse.json("Success");
}
