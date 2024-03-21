import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <div>
      userInfo Page.
      若未登陆，
      <Link href={'/login'}>自动跳转到登陆页</Link>
    </div>
  )
}

export default page
