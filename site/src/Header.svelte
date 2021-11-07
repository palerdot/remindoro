<header>
  <div class={'header-wrapper content'}>
    <a id="logo-container" href="/" class="brand-logo">
      <img src="/favicon.png" alt={'Remindoro'} />
      Remindoro
    </a>
    <div class={'links'}>
      <a href="#help">Help</a>
    </div>
  </div>
</header>

<style>
  header {
    display: flex;
    align-items: center;
    height: 64px;

    background: #360e4e;
    color: #c55ffc;
  }

  .header-wrapper {
    display: flex;
    align-items: center;
  }

  .brand-logo {
    display: flex;
    align-items: center;

    font-size: 2.2rem;
    font-weight: bold;
  }

  .brand-logo > img {
    margin-right: 16px;
  }

  .links {
    margin-left: auto;
  }

  .links > a {
    font-size: 1.25rem;
    margin: 0 8px;
  }

  .links > a:hover {
    text-decoration: underline;
  }
</style>
