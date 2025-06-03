import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { NextResponse } from "next/server";
import {getAuth} from "@clerk/nextjs/server";   

export async function POST(req) {
    try{
        const {userId} = getAuth(req)
        if(!userId){
            return NextResponse.json({success: false, message: "User not authenticated",});
        }
        const {chatId, name} = await req.json();
        await connectDB();
        await Chat.findOneAndUpdate({_id: chatId,userId},{name});
        return NextResponse.json({success: true, message:"Chat renamed"});
    } catch(error){
        return NextResponse.json({success:false ,message: error.message});
    }
}