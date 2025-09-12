/**
 * Error handling utility for promises.
 *
 * This function wraps a promise and returns a tuple:
 *   - [undefined, result] if the promise resolves successfully
 *   - [error] if the promise rejects
 *
 * This pattern allows for concise error handling with async/await,
 * avoiding the need for try/catch blocks and making code more readable.
 *
 * Example usage:
 *   const [result, error] = await catchError(someAsyncFunction())
 *   if (error) {
 *     // handle error
 *   } else {
 *     // use result
 *   }
 *
 * @param promise - The promise to handle
 * @returns A promise that resolves to a tuple: [undefined, T] | [Error]
 */
export function catchError<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> {
  return promise
    .then((data) => {
      // On success, return [undefined, data]
      return [undefined, data] as [undefined, T]
    })
    .catch((error) => {
      // On error, return [error]
      return [error]
    })
}

/* ---------------------------------------------------------
 * Example use of catchErrorTyped (not exported by default)
 * ---------------------------------------------------------
 * This variant allows you to specify custom error types to catch.
 * Useful for distinguishing between different error classes.
 *
 * async function exampleUseOfCatchErrorTyped() {
 *   const [user, error] = await catchErrorTyped(getUser(1), [CustomError])
 *   if (error) {
 *     console.error('Failed to get user:', error)
 *   } else {
 *     console.log('User data:', user)
 *   }
 * }

 * Custom error class example
 * Useful for testing or extending error handling logic.
----------------------------------------------------------
class CustomError extends Error {
  name = 'CustomError'
  extraProp = 'Error: test'
}
*/

/* Custom error handling for specific cases */
export function catchErrorTyped<T, E extends new (message?: string) => Error>(
  promise: Promise<T>,
  errorsToCatch: E[]
): Promise<[undefined, T] | [InstanceType<E>]> {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T]
    })
    .catch((error) => {
      if (errorsToCatch == undefined) {
        return [error]
      }
      if (errorsToCatch.some((errorType) => error instanceof errorType)) {
        return [error]
      }
      throw error
    })
}

