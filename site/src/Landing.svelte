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

  .button {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 340px;
    height: 64px;
    margin: 16px;
    font-size: 1.25rem;
    text-transform: uppercase;

    background: #360e4e;
    color: #c55ffc;

    border: thin solid transparent;
  }

  .button:hover {
    opacity: 0.95;
    border: thin solid #c55ffc;
  }

  .icon {
    width: 32px;
    height: 32px;
    margin-right: 16px;
  }
</style>
