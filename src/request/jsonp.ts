export const jsonp = <T>(api: string, params: object) =>
  new Promise<T>((resolve, reject) => {
    const script = document.createElement("script")
    const callback = `jsonp_${Date.now()}`
    script.src = api + '?' + new URLSearchParams({ ...params, callback })
    script.referrerPolicy = 'no-referrer'
    window[callback] = result => {
      delete window[callback]
      document.body.removeChild(script)
      result ? resolve(result) : reject("404")
    }
    document.body.appendChild(script)
  })