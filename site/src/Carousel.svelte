<script>
  // @ts-nocheck
  // @ts-ignore
  import Carousel from 'svelte-carousel'

  const FEATURES = [
    {
      src: './img/screenshot-1.png',
      description: 'Beter Reminders and Notes in your favorite browser',
      alt: 'Better reminders',
    },
    {
      src: './img/screenshot-2.png',
      description: 'Save text/selection from webpages as notes/reminders.',
      alt: 'save text from webpages',
    },
    {
      src: './img/screenshot-3.png',
      description: 'Set One-time/repeat reminders',
      alt: 'set one-time/repeat reminders',
    },
    {
      src: './img/screenshot-4.png',
      description: 'Configure Date for your reminders',
      alt: 'configure date for reminders.',
    },
    {
      src: './img/screenshot-5.png',
      description: 'Configure Time for your reminders',
      alt: 'configure time for reminders.',
    },
    {
      src: './img/screenshot-6.png',
      description: 'Tweak settings that suit your preference',
      alt: 'customizable settings',
    },
  ]
</script>

<div class={'container'}>
  <Carousel
    autoplay
    autoplayDuration={3140}
    autoplayProgressVisible
    pauseOnFocus
  >
    {#each FEATURES as { src, description, alt }}
      <div class={'holder'}>
        <div class={'image'}>
          <img {src} {alt} />
        </div>
        <div class={'text'}>{description}</div>
      </div>
    {/each}
  </Carousel>
</div>

<style>
  .container {
    padding: 3.14rem 0;
    margin: 3.14rem 0;
    border-top: thin solid #c55ffc;
    border-bottom: thin solid #c55ffc;
  }

  .holder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background: transparent;
    color: #c55ffc;

    padding: 3.14rem 0;

    /* height: 314px; */
  }

  .text {
    display: flex;
    margin: 16px 0;
  }

  .image {
    display: flex;
    border: thin solid #c55ffc;
  }
</style>
