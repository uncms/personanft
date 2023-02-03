function goHome() {
  window.scrollTo(0, 0);
}

function goDetail() {
  location.href = "/detail.html?nft=" + this.getAttribute("nft-id");
}

let nftDatas = [];
let originalDatas = [];
let partnerDatas = [];
let curatedDatas = [];

window.addEventListener("load", async function () {
  web3 = new Web3(window.ethereum);

  const connection = await ethereum.request({ method: "eth_accounts" });

  if (connection.length) {
    await connectWallet();
  }

  nftDatas = [];
  originalDatas = [];
  partnerDatas = [];
  curatedDatas = [];

  nftDatas = JSON.parse(JSON.stringify(nftList));

  for (let i = 0; i < nftDatas.length; i++) {
    if (nftDatas[i].type == "original") {
      originalDatas.push(nftDatas[i]);
    } else if (nftDatas[i].type == "partner") {
      partnerDatas.push(nftDatas[i]);
    } else if (nftDatas[i].type == "curated") {
      curatedDatas.push(nftDatas[i]);
    }
  }

  for (let i = 0; i < originalDatas.length; i++) {
    document
      .querySelector(".original-inventory")
      .appendChild(generateItem(originalDatas[i]));
  }

  for (let i = 0; i < partnerDatas.length; i++) {
    document
      .querySelector(".partner-inventory")
      .appendChild(generateItem(partnerDatas[i]));
  }

  for (let i = 0; i < curatedDatas.length; i++) {
    document
      .querySelector(".curated-inventory")
      .appendChild(generateItem(curatedDatas[i]));
  }
});

function generateItem(_object) {
  let el_wrapper = document.createElement("div");
  el_wrapper.setAttribute("class", "item");
  el_wrapper.setAttribute("nft-id", _object.id);
  el_wrapper.onclick = goDetail;

  let el_banner = document.createElement("img");
  el_banner.src = "img/" + _object.banner;
  el_banner.alt = _object.name + " Banner";

  let el_profile_wrapper = document.createElement("div");
  el_profile_wrapper.setAttribute("class", "item-profile");

  let el_profile = document.createElement("img");
  el_profile.src = "img/" + _object.profile;
  el_profile.alt = _object.name + " Profile";

  let el_tag = document.createElement("div");

  let el_network = document.createElement("div");

  switch (_object.network) {
    case "이더리움":
      el_network.setAttribute("class", "item-ethereum");
      break;
    case "폴리곤":
      el_network.setAttribute("class", "item-polygon");
      break;
    case "클레이튼":
      el_network.setAttribute("class", "item-klaytn");
      break;
  }
  el_network.innerHTML = _object.network;

  let el_step = document.createElement("div");

  if (_object.marketplace == "TBA") {
    el_step.setAttribute("class", "item-ready");
    el_step.innerHTML = "민팅 준비 중";
  } else {
    el_step.setAttribute("class", "item-sale");
    el_step.innerHTML = "2차 거래 중";
  }

  let el_title = document.createElement("div");
  el_title.setAttribute("class", "item-title");
  el_title.innerHTML = _object.name;

  let el_desc = document.createElement("div");
  el_desc.setAttribute("class", "item-desc");
  el_desc.innerHTML = _object.desc;

  el_tag.appendChild(el_network);
  el_tag.appendChild(el_step);

  el_profile_wrapper.appendChild(el_profile);
  el_profile_wrapper.appendChild(el_tag);

  el_wrapper.appendChild(el_banner);
  el_wrapper.appendChild(el_profile_wrapper);
  el_wrapper.appendChild(el_title);
  el_wrapper.appendChild(el_desc);

  return el_wrapper;
}

let web3;
let account = null;
let isConnected = false;

async function connectWallet() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "net_version" }).then((res) => {
      if (res != 137) {
        alert(
          "폴리곤 네트워크로 변경해주세요! You need to change Polygon mainnet!"
        );
        isConnected = false;
      } else {
        isConnected = true;
      }
    });

    if (isConnected) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      account = accounts[0];

      document.querySelector(".connect-wallet").innerHTML =
        account.substring(0, 8) + "...";
    } else {
      account = null;
      document.querySelector(".connect-wallet").innerHTML = "지갑 연결";
    }
  } else {
    alert(
      "메타마스크 설치가 필요합니다! Please install and activate MetaMask!"
    );
    return;
  }
}
