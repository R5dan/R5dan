function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function run() {
  const urls = await Bun.file("../history.json").json();

  while (true) {
    const url = urls[getRandomInt(urls.length)];
    if (!url) {
      console.log("Continuing...");
      continue;
    }
    console.log("Fetching");
    await fetch(url.url);
    await Bun.sleep(3000);
  }
}

run();
