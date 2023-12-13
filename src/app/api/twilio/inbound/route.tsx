import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest){
    console.log("inbound message!!!");
    const data = await req.formData();
    const from = data.get("From");
    const messageSid = data.get("MessageSid");
    const optOutType = data.get("OptOutType");
    const body = data.get("body");
    // toggle user if has OptOutType
        // if (optOutType === "START")
        // if (optOutType === "START")

    // create Inbox Item?
    console.log(data)
    return NextResponse.json("Success");
}