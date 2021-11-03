// ref: https://dev.to/praveenkumarrr/cancellable-promises-in-react-and-why-is-it-required-5ghf

export const cancellablePromise = <T>(promise: Promise<T | void>) => {
  const isCancelled = { value: false }
  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then(d => {
        // if promise is cancelled noop
        if (isCancelled.value) {
          // noop do not proceed
          return
        }

        resolve(d)
      })
      .catch(e => {
        reject(isCancelled.value ? isCancelled : e)
      })
  })

  return {
    promise: wrappedPromise,
    cancel: () => {
      isCancelled.value = true
    },
  }
}
