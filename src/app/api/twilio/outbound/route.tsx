import { NextRequest, NextResponse } from 'next/server';
import { api } from '~/trpc/server';


export async function POST(req: NextRequest){
    const data = await req.formData();
    const messageSid = data.get("MessageSid")?.toString(); /* twilio message id*/
    const messageStatus = data.get("MessageStatus")?.toString(); /* accepted, scheduled, queued, sent, delivered*/
    const from = data.get("From")?.toString();
    const doneDate = data.get("RawDlrDoneDate")?.toString() || null;

    // update message status
    if(messageSid && messageStatus){
       const updatedWebhook = api.post.updateOutboundWebhook.mutate({smsSid: messageSid, status: messageStatus, from: from || null, doneDate: doneDate,})
    }
    
    return NextResponse.json("Success");
}