import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest){
    console.log("outbound message!!!");
    const data = await req.formData();
    const messageSid = data.get("MessageSid"); /* twilio message id*/
    const messageStatus = data.get("MessageStatus"); /* queued, sent, delivered*/
    const to = data.get("To"); /* subscriber number*/

    // store message status
    console.log(data);
    
    return NextResponse.json("Success");
}