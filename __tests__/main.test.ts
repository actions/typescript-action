import {getJobName}  from '../src/main'

test('Job Only', () => {
    const res = getJobName('job','','')
    expect(res).toBe('job')
})

test('Job plus os', () => {
    const res = getJobName('job','ubuntu-latest','')
    expect(res).toBe('job (ubuntu-latest)')
})

test('Job plus os and node version', () => {
    const res = getJobName('job','ubuntu-latest','12')
    expect(res).toBe('job (ubuntu-latest, 12)')
})