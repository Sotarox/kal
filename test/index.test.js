// https://fireflysemantics.medium.com/unit-testing-commander-scripts-with-jest-bc32465709d6
// TODO: refine test code to read index.ts file directly. ts-jest is candidate to realize it.

let path = require('path');
let exec = require('child_process').exec;
test('Code should be 0', async () => {
  let result = await  cli(['0202', '0208'], '.');
  console.log(result.stdout);
  expect(result.code).toBe(0);
})

function cli(args, cwd) {
  return new Promise(resolve => { 
    exec(`node ${path.resolve('dist/index')} ${args.join(' ')}`,
    { cwd }, 
    (error, stdout, stderr) => { resolve({
    code: error && error.code ? error.code : 0,
    error,
    stdout,
    stderr })
  })
})}