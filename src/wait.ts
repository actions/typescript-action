/**
 * Waits for a number of milliseconds.
 *
 * @param milliseconds Number of milliseconds to wait.
 * @returns Resolves with 'done!' after the wait is over.
 */
export function wait(milliseconds: number): Promise<string> {
  if (Number.isNaN(milliseconds)) {
    throw new Error("The 'milliseconds' parameter must be a valid number.")
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve('done!'), milliseconds)
  })
}
