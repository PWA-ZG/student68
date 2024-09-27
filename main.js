const fetchList = async () => {
  try {
    const res = await fetch("https://restcountries.com/v3.1/region/europe");
    const json = await res.json();

    document.body.removeChild(document.getElementById("fetch"));
    const errorText = document.getElementById("error");
    errorText && document.body.removeChild(errorText);

    const list = document.createElement("ul");
    list.className = "list";

    json.forEach((c) => {
      const listItem = document.createElement("li");
      listItem.className = "list-item";

      const text = document.createElement("span");
      text.innerText = c.name.common;

      const image = document.createElement("img");
      image.setAttribute("src", c.flags.svg);
      image.setAttribute("height", "20");

      listItem.appendChild(text);
      listItem.appendChild(image);
      list.appendChild(listItem);
    });

    document.body.appendChild(list);
  } catch {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register("countries-fetch");

      if (!document.getElementById("error")) {
        const errorText = document.createElement("p");
        errorText.setAttribute("id", "error");
        errorText.innerText =
          "Dohvat država nije uspio. Države će se dohvatiti kada uspostavite vezu s internetom.";

        document.body.appendChild(errorText);
      }
    } catch {
      // quietly fail
    }
  }
};

document.getElementById("fetch").addEventListener("click", async () => {
  document.getElementById("fetch").setAttribute("disabled", true);

  fetchList();
});

document.getElementById("share").addEventListener("click", async () => {
  const shareData = {
    title: "Države u Europi",
    text: "Popis svih država u Europi",
    url: window.location.href,
  };
  try {
    navigator.share(shareData);
  } catch (e) {
    navigator.clipboard.writeText(shareData.url);
    alert("Native share API not supported. URL copied to clipboard!");
  }
});

if ("serviceWorker" in navigator)
  navigator.serviceWorker.register("/serviceWorker.js").then(() => {
    navigator.serviceWorker.addEventListener("message", () => {
      fetchList();
    });
  });
