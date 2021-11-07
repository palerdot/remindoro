<script>
  import ChromeIcon from './Icons/Chrome.svelte'
  import FirefoxIcon from './Icons/Firefox.svelte'
</script>

<section>
  <h3 class={'title'}>{'Reminders in your Browser'}</h3>
  <h4 class={'subtitle'}>
    {'Set Reminders (repeat/one-time) or take notes.'}
  </h4>
  <div class={'links'}>
    <a
      href={'https://chrome.google.com/webstore/detail/remindoro/njmniggbfobokemdjebnhmbldimkofkc'}
      target="_blank"
      class={'button'}
    >
      <span class={'icon'}>
        <ChromeIcon />
      </span>
      <span>Get Chrome Extension</span>
    </a>
    <a
      href={'https://addons.mozilla.org/en-GB/firefox/addon/remindoro/'}
      target="_blank"
      class={'button'}
    >
      <span class={'icon'}>
        <FirefoxIcon />
      </span>
      <span>Get Firefox Extension</span>
    </a>
  </div>
</section>

<style>
  section {
    padding: 3.14rem 0;
  }

  .title {
    font-size: 3.14rem;
    font-weight: normal;

    text-align: center;
  }

  .subtitle {
    font-size: 1.5rem;
    font-weight: 200;

    text-align: center;
  }

  .links {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 3.14rem 0;
  }
</style>
