'use client'

import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import Image from 'next/image'
import React from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const ChatLabel = ({ id, name, openMenu, setOpenMenu }) => {
  const { fetchUsersChats, chats, setSelectedChat } = useAppContext()

  const selectChat = () => {
    const chatData = chats.find(chat => chat._id === id)
    setSelectedChat(chatData)
    console.log(chatData)
  }

  const renameHandler = async () => {
    try {
      const newName = prompt('Enter New Name')
      if (!newName) return
      const { data } = await axios.post('/api/chat/rename', { chatId: id, name: newName })
      if (data.success) {
        fetchUsersChats()
        setOpenMenu({ id: 0, open: false })
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteHandler = async () => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this chat?')
      if (!confirmDelete) return
      const { data } = await axios.post('/api/chat/delete', { chatId: id })
      if (data.success) {
        fetchUsersChats()
        setOpenMenu({ id: 0, open: false })
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div
      onClick={selectChat}
      className='flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer'
    >
      {/* Show the title (fallback to "New Chat" if name is empty) */}
      <p className='group-hover:max-w-[83.3333%] truncate'>{name || "New Chat"}</p>

      <div
        onClick={e => {
          e.stopPropagation()
          setOpenMenu({ id: id, open: !openMenu.open || openMenu.id !== id })
        }}
        className='group relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg'
      >
        <Image
          src={assets.three_dots}
          alt=''
          className={`w-4 ${openMenu.open && openMenu.id === id ? 'block' : 'hidden'} group-hover:block`}
        />
        <div
          className={`absolute ${
            openMenu.id === id && openMenu.open ? 'block' : 'hidden'
          } -right-36 top-6 bg-gray-700 rounded-xl w-max p-2 z-10`}
        >
          <div
            className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer'
            onClick={renameHandler}
          >
            <Image src={assets.pencil_icon} alt='' className='w-4' />
            <p>Rename</p>
          </div>
          <div
            className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer'
            onClick={deleteHandler}
          >
            <Image src={assets.delete_icon} alt='' className='w-4' />
            <p>Delete</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatLabel
