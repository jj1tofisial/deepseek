import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { NextResponse } from "next/server";
import {getAuth} from "@clerk/nextjs/server";   

export async function POST(req) {
  try{
    const {userId} = getAuth(req)
    if(!userId){
        return NextResponse.json({success: false, message: "User not authenticated",}
        )
    }
    const chatData ={
        userId,
        messages: [],
        name: "New Chat",
    };
    //connecting DataBase
    await connectDB();
    await Chat.create(chatData);
    return NextResponse.json({success: true, message:"Chat created"});
  } catch(error){
    return NextResponse.json({success:false ,message: error.message});

  }
}