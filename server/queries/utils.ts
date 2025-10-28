export function handleQuery<T, A extends any[]>(
  errMsg: string,
  cb: (...args: A) => Promise<T>
) {
  return async (...args: A): Promise<T> => {
    try {
      return await cb(...args);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`Error in ${cb.name}(): `, error.message);
        console.log(error.stack);

        throw new Error(error.message || errMsg);
      } else {
        console.log(`Unknown error in ${cb.name}: `, error);
        throw new Error(errMsg);
      }
    }
  };
}
