import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { NextResponse } from "next/server";
import {getAuth} from "@clerk/nextjs/server";   

export async function GET(req){
  try {
    const {userId} = getAuth(req)
    if(!userId){
        return NextResponse.json({success: false, message: "User not authenticated",}
        );
    }
    //connect to DB and fetch chats
    await connectDB();
    const data = await Chat.find({userId});

    return NextResponse.json({success:true, data})
  } catch (error) {
    return NextResponse.json({success:false ,message: error.message});
  }
}