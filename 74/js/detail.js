const dateTitle = document.getElementById("dateTitle");
const backBtn = document.getElementById("backBtn");
const homeBtn = document.getElementById("homeBtn");

const photoInput = document.getElementById("photoInput");
const calInput = document.getElementById("calInput");
const memoInput = document.getElementById("memoInput");
const saveBtn = document.getElementById("saveBtn");
const entries = document.getElementById("entries");

const imgModal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
const modalClose = document.getElementById("modalClose");

const selectedDate = localStorage.getItem("selectedDate");
dateTitle.textContent = selectedDate;

backBtn.addEventListener("click", () => history.back());
homeBtn.addEventListener("click", () => location.href = "index.html");

const STORAGE_KEY = "records";

function loadAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}
function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function render() {
  const all = loadAll();
  const list = all[selectedDate] || [];

  entries.innerHTML = "";

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "entry";

    const img = document.createElement("img");
    img.className = "entryImg";
    img.src = item.image;

    img.addEventListener("click", () => {
        imgModal.classList.remove("hidden");
        modalImg.src = item.image;
    });

    const info = document.createElement("div");
    info.className = "entryInfo";
    info.innerHTML = `
      <div class="entryCal">${item.calories} kcal</div>
      <div class="entryMemo">${item.memo || ""}</div>
    `;

    const del = document.createElement("button");
    del.className = "entryDel";
    del.textContent = "🗑";
    del.addEventListener("click", () => {
      const all2 = loadAll();
      all2[selectedDate] = (all2[selectedDate] || []).filter(x => x.id !== item.id);
      saveAll(all2);
      render();
    });

    card.appendChild(img);
    card.appendChild(info);
    card.appendChild(del);
    entries.appendChild(card);
  });
}

// 画像ファイルをbase64 に変換
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

saveBtn.addEventListener("click", async () => {
  const file = photoInput.files[0];
  const calories = Number(calInput.value);

  if (!file) return alert("写真を選んでください");
  if (!calories || calories <= 0) return alert("カロリーを入力してください");

  const imageData = await fileToDataURL(file);

  const all = loadAll();
  const list = all[selectedDate] || [];
  list.push({
    id: Date.now(),
    calories,
    memo: memoInput.value.trim(),
    image: imageData
  });
  all[selectedDate] = list;

  saveAll(all);

  // 入力リセット
  photoInput.value = "";
  calInput.value = "";
  memoInput.value = "";

  render();
});

render();

// ×ボタンで閉じる
modalClose.addEventListener("click", () => {
  imgModal.classList.add("hidden");
});

// 背景をクリックしたら閉じる（画像をクリックしたときは閉じない）
imgModal.addEventListener("click", (e) => {
  if (e.target === imgModal) {
    imgModal.classList.add("hidden");
  }
});
