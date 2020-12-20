export async function waitUntil (callBack: () => Promise<boolean>, timeout: number = 3000, pollInterval: number = 10) {
  const endTime = Date.now() + timeout
  return checkInInterval(callBack, endTime, pollInterval)
}

async function checkInInterval (callback: () => Promise<boolean>, endTime: number, pollInterval: number) {
  if (await callback()) return
  if (Date.now() > endTime) return Promise.reject(new Error('Timeout occured'))

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(checkInInterval(callback, endTime, pollInterval))
    }, pollInterval)
  })
}
