"use client"
import { Button } from '@/components/ui/button'
import Link  from 'next/link'
import React from 'react'

const Issues = () => {
  return (
    <div>
      <Button><Link href="/issues/new">New Issue</Link></Button>
    </div>
  )
}

export default Issues