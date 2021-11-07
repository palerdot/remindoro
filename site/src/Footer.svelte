<script>
</script>

<footer>
  <div class={'footer-wrapper content'}>
    <div class={'about'}>
      <h3>{'About'}</h3>
      <div class={'about-text'}>
        {`As a person who spend most of the time in a desktop Browser (currently Firefox, previously Chrome), I wanted a way to remind myself to take scheduled breaks instead of sitting continously in front of a computer screen. Also, when I come across some important web pages/articles, I needed a way to read it later. This browser Extension is created to solve both of these problems. There will be more improvements/features for this extension in the future. If you are a regular user of this extension, please give your feedbacks in the Firefox or Chrome extensions page.`}
      </div>
    </div>
    <div class={'links'}>
      <h3>{'Connect'}</h3>
      <a
        href={'https://github.com/palerdot/remindoro'}
        class={'link'}
        target={'_blank'}>{'Chrome Extension'}</a
      >
      <a
        href={'https://github.com/palerdot/remindoro'}
        class={'link'}
        target={'_blank'}>{'Firefox Extension'}</a
      >
      <a
        href={'https://github.com/palerdot/remindoro'}
        class={'link'}
        target={'_blank'}>{'Github'}</a
      >
    </div>
  </div>
</footer>

<style>
  footer {
    display: flex;
    align-items: center;

    background: #360e4e;

    padding-bottom: 3.14rem;
  }

  .footer-wrapper {
    display: flex;
  }

  .about {
    display: flex;
    flex: 2;
    flex-direction: column;

    padding-right: 2rem;
  }

  .about-text {
    color: #c55ffc;
  }

  .links {
    margin-left: auto;

    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .link {
    text-decoration: underline;
    color: #c55ffc;

    padding: 4px 0;
  }
</style>
