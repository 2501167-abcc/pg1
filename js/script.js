const addBtn = document.getElementById("myBtn");
const dateInput = document.getElementById("dateInput");
const folderArea = document.getElementById("folderArea");
const messageArea = document.getElementById("messageArea");

// 今日の日付を自動で入れる
const today = new Date();
const yyyy = today.getFullYear();     // today.getFullYear()は 年だけ取り出す     //Stringは数字を文字に変換,1 → "1"
const mm = String(today.getMonth() + 1).padStart(2, "0");                       //today.getMonth()+1 ...月を数字で返す。0~11で返ってくるから＋１している。例：０＝ 1月
const dd = String(today.getDate()).padStart(2, "0");                            //.padStart(2, "0")は文字の長さを2にそろえる,例："1" → "01"  "31" → "31"                                                                              //日付入力欄は「01」形式じゃないと表示されなくなる
dateInput.value = yyyy + "-" + mm + "-" + dd;

// 日付を保存する配列
let addDate = [];

const savedDates = localStorage.getItem("dates");
if (savedDates) {
    addDate = JSON.parse(savedDates);
    renderFolders();
}

// 画面表示用の関数
function renderFolders() {
    folderArea.innerHTML = "";      //表示エリアの中身を 全部消す。その後配列を最初から最後まで見て1個ずつHTMLを作って並べる

    addDate.forEach(function(date){
        const div = document.createElement("div");
        addDate.sort(); //日付の昇順に並べる
        div.className = "folder";

        const img = document.createElement("img");
        img.src = "img/folder.png";  
        img.alt = "folder";
        img.className = "folderImg";

        // 日付文字
        const p = document.createElement("p");
        p.textContent = date;
        p.className = "folderText";

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑";
        delBtn.className = "deleteBtn";

        // ゴミ箱を押したら削除
        delBtn.addEventListener("click", function (e) {
            e.stopPropagation(); 

            if (!confirm(date + " を削除しますか？")) return;   //間違って削除しないために、削除の確認を出す

            // 配列から削除（date 以外を残す）
            addDate = addDate.filter(function (d) {
                return d !== date;
            });

            // 保存
            localStorage.setItem("dates", JSON.stringify(addDate));

            // 再描画
            renderFolders();
        });


        div.appendChild(img);
        div.appendChild(p);
        div.appendChild(delBtn);

        div.addEventListener("click", function () {          // クリックできるようにする
            openDetail(date);
        });

        folderArea.appendChild(div);
    });
}

// ボタンをクリックした時
addBtn.addEventListener("click", function () {
    const selectedDate = dateInput.value;

    if(addDate.includes(selectedDate)){
        messageArea.textContent = "この日付はすでに追加されています";
        setTimeout(function(){
            messageArea.textContent = "";
        }, 3000);
        return;
   }      
    messageArea.textContent ="";    // 正常時は消す                            
    addDate.push(selectedDate);     //データが変わったら、それを元に画面を作り直す
    localStorage.setItem("dates", JSON.stringify(addDate));
    renderFolders();
});

function openDetail(date) {
  localStorage.setItem("selectedDate", date);
  location.href = "detail.html";
}

