async function keepAlive() {
  // just keeping the process alive, useful in development until we actually have some kind of a server running
  await new Promise(resolve => setTimeout(resolve, 5000));
  setImmediate(keepAlive);
}

(async () => {
  keepAlive();

  // tslint:disable-next-line:no-console
  console.log('Started application');
})();
