export function wait(milliseconds: number) {
    return new Promise((resolve) => {
        if (isNaN(milliseconds)) { 
            throw new Error('milliseconds not a number'); 
        }

        setTimeout(() => resolve("done!"), milliseconds)
    });
}
  
