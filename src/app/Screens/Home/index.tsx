import React from 'react'
import { useSelector } from 'react-redux'

import type { RootState } from '@app/Store/'

import Remindoros from '@app/Components/Remindoros/'

function Home() {
  const remindoros = useSelector((state: RootState) => state.remindoros)

  return (
    <div>
      {'porumai ... wait and hope ... HOME screen'}
      <Remindoros remindoros={remindoros} />
    </div>
  )
}

export default Home
