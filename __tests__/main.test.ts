import { wait } from '../src/wait';

test('throws invalid number', async () => {
    const input = parseInt('foo', 10);
    await expect(wait(input)).rejects.toThrow('milliseconds not a number');
});

test('wait 500 ms', async () => {
    const start = new Date();
    await wait(500);
    const end = new Date();
    var delta = Math.abs(end.getTime() - start.getTime());
    expect(delta).toBeGreaterThan(450);
});
