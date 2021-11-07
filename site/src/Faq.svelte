<script>
  const FAQS = [
    {
      question: 'How to edit a note/reminder?',
      answer:
        'Click on the card in the home page. You will navigate to a dedicated screen to edit your note. In the dedicated screen, you can also make use of the new experimental rich text editor. To configure reminder/repeat settings, click on the button in the bottom right corner of the screen.',
    },
    {
      question: 'How to go to home screen after editing a note?',
      answer:
        'You can click on the home icon in the header (top right part of the screen) to get back to the home screen.',
    },
    {
      question: 'How to schedule Reminders?',
      answer: `To configure reminder/repeat settings, click on the button in the bottom right corner of the edit screen. Clicking on the menu, will give you following options. 
      
- Add a One-time reminder. The default one-time reminder will be set 45 minutes from the current time.
- Add a repeatable reminder. Set a repeatable reminder, which can be repeated for every minute, hour, day or months.
- Delete the Reminder
   `,
    },
    {
      question: 'How to pause notifications temporarily?',
      answer:
        'You can pause/resume notifications from bottom left corner of the screen. You will see a green/red color bell icon. You can click on it to pause/resume notifications. You can also do this from the settings screen.',
    },
    {
      question:
        'What happens if the One-Time Reminder is already past when the Browser is opened?',
      answer:
        'For one-time reminders, if the already past reminder is atmost 15 minutes old, the reminder will be shown in a minute after browser is opened. Since, Browser is not an ever running app, currently, if it is just 15 minutes old, the reminder is shown. ',
    },
    {
      question:
        'What happens if the repeatable reminder is already past when the Browser is opened? ',
      answer: ` For repeatable reminders, if the reminder is already past when browser is opened, the reminder is updated for the next scheduled time based on the repeat interval. There will no notification shown for already past repeatable reminders. You can always view current scheduled reminders by clicking the Events menu on the top right corner.

If the repeatable reminder is scheduled to repeat in minutes or hours, the already past reminder is scheduled to repeat from the current time. If the reminder is scheduled to repeat in days or months, the next reminder date & is calculated from the already past date & time.`,
    },
    {
      question: 'How to save a current web page in Remindoro Extension?',
      answer:
        'Right Click on the Web page and click "Add to Remindoro" Option shown in the options. This will add the current web page details in the Remindoro Extension. You can then add reminder options later if needed.',
    },
    {
      question: 'Can we save text in web pages in Remindoro Extension?',
      answer:
        'Yes. Select text in a web page and right click. Then, click the "Save to Remindoro" option to save the highlighted text to Remindoro Extension.',
    },
    {
      question: 'Can I sync my reminders/notes to cloud?',
      answer:
        'Currently Remindoro is an offline only app. It is more useful for creating transient reminders/notes. If you would like to have this feature, please leave feedback at palerdot@gmail.com',
    },
    {
      question: 'How can I give feedback for the extension?',
      answer:
        'If you have any feedback or ideas, please share it as a comment in Firefox or Chrome Extensions page. You also send feedback to me personally at palerdot@gmail.com',
    },
  ]
</script>

<section id="help">
  <div class={'heading'}>{'Help'}</div>
  <div class={'subheading'}>
    {'The following FAQ explains important features and behaviours of the Extension.'}
  </div>
  <div class={'faq-holder'}>
    {#each FAQS as { question, answer }}
      <div class={'faq-wrapper'}>
        <div class={'question'}>{question}</div>
        <div class={'answer'}>{answer}</div>
      </div>
    {/each}
  </div>
  <div class={'subheading'}>
    {'If you like this extension please leave a rating in'}
    <a
      href={'https://chrome.google.com/webstore/detail/remindoro/njmniggbfobokemdjebnhmbldimkofkc'}
      target="_blank"
      class={'link'}
    >
      <span>Chrome Extension Page</span>
    </a>
    {' or '}
    <a
      href={'https://addons.mozilla.org/en-GB/firefox/addon/remindoro/'}
      target="_blank"
      class={'link'}
    >
      <span>Firefox Extension Page</span>
    </a>
  </div>
</section>

<style>
  .heading {
    text-align: center;
    font-size: 2.5rem;
  }

  .subheading {
    text-align: center;
    font-size: 1.1rem;
    margin: 1rem 0;
  }

  .faq-holder {
    background: #360e4e;
    margin: 2rem 0;
  }

  .faq-wrapper {
    padding: 1.5rem;
    border-bottom: thin solid #c55ffc;
  }

  .question {
    font-size: 1.5rem;
  }

  .answer {
    margin: 16px 0;
    line-height: 1.75rem;
    font-size: 1.1rem;
    font-weight: 100;
    white-space: pre-wrap;
  }

  .link {
    color: #c55ffc;
  }
</style>
