import React from 'react'
import { get, some, isNumber, isBoolean } from '@lodash'
import { useSelector } from 'react-redux'

import type { RootState } from '@app/Store/'

import { OldRemindoro } from '@app/Util/cleaners'
import { Remindoro } from '@app/Store/Slices/Remindoros/'

// HOC that renders the children component if chrome migration is not done
type Props = {
  children: React.ReactNode
}

// helper function that calculates if data migration is done (by chrome)
/* 

const BUGGY_CHROME_DATA = [
  {
    created: 1636124214653,
    id: 17,
    list: [],
    note: 'porumai ... wait and hope ...&nbsp;',
    reminder: {
      is_repeat: true,
      repeat: {
        interval: 'minutes',
        time: '56',
      },
      time: 1636643746938,
    },
    title: 'Chrome - 1.0.1',
    type: 'note',
    updated: 1636264261644,
  },
  {
    created: 1485780891370,
    id: 1,
    list: [],
    note: 'Taking a walk for every 45 minutes is good for your health. Avoid continous sitting for long hours. Remember, `Sitting is the new Smoking`.    \n',
    reminder: {
      is_repeat: true,
      repeat: {
        interval: 'minutes',
        time: '45',
      },
      time: 1636643086941,
    },
    title: 'Chrome Take a Walk',
    type: 'note',
    updated: 1636548829008,
  },
  {
    created: 1510158581802,
    id: 16,
    list: [],
    note: "Hi, I'm Arun, a Javascript programmer, primarily interested to work with ReactJS. I'm curious about this position and would like to know more about this job.   \n  \nYou can know more about me from the following links.   \n  \nGithub Profile - http://github.com/palerdot   \nShort Resume - http://palerdot.in/resume/arun-kumar.pdf   \nWebsite - https://palerdot.in   \nStackOverflow Profile https://stackoverflow.com/users/1410291/palerdot   \n  \nLooking forward to hearing back from you.   \n  \nRegards,   \nArun.   \n",
    reminder: {
      is_repeat: false,
      repeat: {
        interval: 'minutes',
        time: 45,
      },
      time: 1636643086941,
    },
    title: 'Porumai! apply',
    type: 'note',
    updated: 1636567220453,
  },
  {
    created: 1485780903441,
    id: 2,
    list: [],
    note: '---|  |--------------------------------------------------------------  \n  \n----------------------------------------------------------------------  \n  \n---| movies  |--------------------------------------------------------------  \ngrizzly man  \nwhat matters at the end of life  \n----------------------------------------------------------------------  \n---| books |--------------------------------------------------------------  \nTools of titans  \n  \nhttps://sivers.org/book  \n  \nGood to great - Jim Collins  \nScaling up - Verne Harnish,  \nAbundance - Peter Diamandis  \nhow to fail at almost everything and still win big  \ndaily rituals - masson currey  \nAnything you want - Derek Sivers  \nDiaries of Henry David Thoreau  \nOn the shortness of life - Seneca  \nIf This Is a Man / The Truce by Primo Levi   \nStart with No  \nThe Goal by Eliyahu M. Goldratt  \n  \n  \nThe Power of persuasion - Robert Levine  \nGenghis Khan and the Making of the Modern World  \n  \nThe war of art  \n  \n10% happier  \n  \nHow to win friends and influence people - Dale carnegie  \nBird by bird - Anne Lamott (book on writing)  \nThe Art of asking - Amanda palmer  \nDropping ashes on the buddha  \n  \nThe One thing  \nAndre Agassi Open  \nwalden  \n“Start with Why by Simon Sinek”  \nThe Secrets of Consulting by Gerald Weinberg.  \n----------------------------------------------------------------------  \n  \n  \n---|  writing  |--------------------------------------------------------------  \njavascript for beginners  \ntech book reviewers - Manning, packtpub, tophat, oreilly  \n?? workwithus@oreilly.com  \n----------------------------------------------------------------------  \n  \ngithub static blog jekyll  \nfrontend developers slack channel - just 1000 rs as freelancer  \n  \nimovie videos  \nfountain syntax  \nmovie jingles drafting  \n  \n',
    reminder: {
      is_repeat: true,
      repeat: {
        interval: 'days',
        time: '5',
      },
      time: '2021-11-11T15:58:00+05:30',
    },
    title: 'Now list',
    type: 'note',
    updated: 1636549109011,
  },
  {
    created: 1488471955395,
    id: 9,
    list: [],
    note: "I'm a generalist programmer working primarily with Javascript. I'm looking for part-time/contracting job. I will be able to spend around 10-15 hours per week for the project. If you are a one-man/small-size software shop who needs a reliable hand in solving your business problems, please reach out to me.  \n  \nKeywords:- VueJS, React, Backbone, d3, bower, gulp, webpack- node (express), php (slim, codeigniter), python - ubuntu/centos server, vagrant, nginx  \nWebsite: http://palerdot.in  \ngithub: https://github.com/palerdot  \nemail: palerdot@gmail.com  \n",
    title: 'Freelancer pitch',
    type: 'note',
    updated: 1636640407301,
  },
  {
    created: 1488039560999,
    id: 6,
    list: [],
    note: 'https://www.youtube.com/watch?v=70nGRBvqFNw',
    reminder: {
      is_repeat: true,
      repeat: {
        interval: 'days',
        time: '5',
      },
      time: '2021-11-14T22:34:00+05:30',
    },
    title: 'Becoming Warren Buffett 2017 (HBO Documentary Films) - YouTube',
    type: 'note',
    updated: 1488039579306,
  },
]

*/

export function isOldRemindoro(
  remindoro: OldRemindoro | Remindoro
): remindoro is OldRemindoro {
  const isBadRepeat = isBoolean(get(remindoro, 'reminder.is_repeat'))
  const reminderPresent = get(remindoro, 'reminder', false)
  const isBadTime =
    reminderPresent && !isNumber(get(remindoro, 'reminder.time'))

  return isBadRepeat || isBadTime
}

function isDataCorrupt(data: Array<{}>): boolean {
  // we have one main check
  // check 1: reminder.is_repeat is a boolean
  // check 2: reminder.time should be a number
  return some(data, isOldRemindoro)
}

function WithChromeError({ children }: Props) {
  const remindoros = useSelector((state: RootState) => state.remindoros)

  if (!isDataCorrupt(remindoros)) {
    return null
  }

  return <>{children}</>
}

export default WithChromeError
