import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { BiArrowBack, BiHomeAlt2 } from 'react-icons/bi'
import { MdBackspace } from 'react-icons/md'

export default function Navbar() {
  const router = useRouter()
  return (
    <div className='w-11/12 gap-3 mx-auto flex p-2 m-2'>
      <button type="button" onClick={() => router.back()} >

        <BiArrowBack className='w-14 h-14 rounded-full  hover:scale-110 duration-150 border-2 p-2' />
      </button>

      <Link href='/'>
        <BiHomeAlt2 className='w-14 h-14 rounded-full  hover:scale-110 duration-150 border-2 p-3' />
      </Link>


    </div>
  )
}
