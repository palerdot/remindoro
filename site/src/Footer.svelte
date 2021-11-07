<script>
  import pkg from '../../package.json'
</script>

<footer>
  <div class={'footer-wrapper content'}>
    <div class={'about'}>
      <div class={'about-text'}>
        {`v${pkg.version}`}
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
    justify-content: flex-end;

    padding-right: 2rem;
  }

  .about-text {
    color: #c55ffc;
  }

  .links {
    margin-left: auto;

    display: flex;
    align-items: flex-end;
    flex: 1;
    flex-direction: column;
  }

  .link {
    text-decoration: underline;
    color: #c55ffc;

    padding: 4px 0;
  }
</style>
