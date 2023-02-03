function goHome() {
  window.location.href = "/";
}

let nftDatas = [];
let urlSearch = null;
let nftID = 0;

window.addEventListener("load", async function () {
  web3 = new Web3(window.ethereum);

  const connection = await ethereum.request({ method: "eth_accounts" });

  if (connection.length) {
    await connectWallet();
  }

  nftDatas = [];
  nftDatas = JSON.parse(JSON.stringify(nftList));

  urlSearch = new URLSearchParams(location.search);

  nftID = parseInt(urlSearch.get("nft"));

  generateDetail(nftDatas[nftID]);
});

const nftBanner = document.querySelector(".nft-banner");
const nftProfile = document.querySelector(".nft-profile-image");
const nftNetwork = document.querySelector(".item-polygon");
const nftStep = document.querySelector(".item-sale");
const nftTitle = document.querySelector(".nft-title");
const nftDesc = document.querySelector(".nft-desc");
const infoDescs = document.querySelectorAll(".info-desc");
const purchase = document.querySelector(".purchase");

function generateDetail(_object) {
  nftBanner.src = "img/" + _object.banner;
  nftBanner.alt = _object.name + " Banner";

  nftProfile.src = "img/" + _object.profile;
  nftProfile.alt = _object.name + " Profile";

  nftNetwork.innerHTML = _object.network;

  switch (_object.network) {
    case "이더리움":
      nftNetwork.classList.replace("item-polygon", "item-ethereum");
      infoDescs[0].innerHTML = "Ethereum Network";
      break;
    case "폴리곤":
      infoDescs[0].innerHTML = "Polygon Network";
      break;
    case "클레이튼":
      nftNetwork.classList.replace("item-polygon", "item-klaytn");
      infoDescs[0].innerHTML = "Klaytn Network";
      break;
  }

  if (_object.marketplace == "TBA") {
    nftStep.classList.replace("item-sale", "item-ready");
    nftStep.innerHTML = "민팅 준비 중";
  } else {
    nftStep.innerHTML = "2차 거래 중";
  }

  nftTitle.innerHTML = _object.name;
  nftDesc.innerHTML = _object.desc;

  infoDescs[0].href = _object.scan;

  if (_object.contract != "TBA") {
    infoDescs[1].href = _object.scan + "/token/" + _object.contract;
  } else {
    infoDescs[1].removeAttribute("href");
    infoDescs[1].removeAttribute("target");
    infoDescs[1].style.textDecoration = "none";
    infoDescs[1].style.cursor = "default";
  }

  infoDescs[1].innerHTML = _object.contract;

  if (_object.web != "TBA") {
    infoDescs[2].href = _object.web;
  } else {
    infoDescs[2].removeAttribute("href");
    infoDescs[2].removeAttribute("target");
    infoDescs[2].style.textDecoration = "none";
    infoDescs[2].style.cursor = "default";
  }

  infoDescs[2].innerHTML = _object.web;

  if (_object.community != "TBA") {
    infoDescs[3].href = _object.community;
  } else {
    infoDescs[3].removeAttribute("href");
    infoDescs[3].removeAttribute("target");
    infoDescs[3].style.textDecoration = "none";
    infoDescs[3].style.cursor = "default";
  }

  infoDescs[3].innerHTML = _object.community;

  if (_object.sns != "TBA") {
    infoDescs[4].href = _object.sns;
  } else {
    infoDescs[4].removeAttribute("href");
    infoDescs[4].removeAttribute("target");
    infoDescs[4].style.textDecoration = "none";
    infoDescs[4].style.cursor = "default";
  }

  infoDescs[4].innerHTML = _object.sns;

  if (_object.marketplace != "TBA") {
    infoDescs[5].href = _object.marketplace;
    purchase.href = _object.marketplace;
  } else {
    infoDescs[5].removeAttribute("href");
    infoDescs[5].removeAttribute("target");
    infoDescs[5].style.textDecoration = "none";
    infoDescs[5].style.cursor = "default";

    purchase.removeAttribute("href");
    purchase.removeAttribute("target");
    purchase.innerHTML = "현재 민팅을 준비하고 있습니다...";
    purchase.style.cursor = "default";
    purchase.style.backgroundColor = "#101010";
  }

  infoDescs[5].innerHTML = _object.marketplace;
}

let commentCount = 0;
let commenters = [];
let accumulatedComments = [];
let currentComments = [];
let isLoading = false;

function loadComments() {
  isLoading = true;

  commentCount = 8;

  commenters = [
    "0x3845as2d1",
    "0xasdfq8we7",
    "0xdf4q8we44",
    "0xqwo878wee",
    "0x57qw5s1d8",
    "0xs8q52s1d5",
    "0x65s78w4e5",
    "0x5s7d89q5s",
  ];
  accumulatedComments = [1, 1, 2, 3, 1, 2, 6, 1];

  currentComments = [
    "스토리도 좋고 캐릭터들도 넘나 매력 있네요! 나만의 신수 캐릭터를 내 입맛대로 키우는 재미가 쏠쏠할 듯",
    "신수는 오래가는 P2E가 되었으면 합니다!",
    "실물적인 혜택보다는 게임답게 유저 경쟁 구도로 성장시키는 NFT군요! 게임 좋아하시는분들은 관심 가질 듯",
    "프리민팅에다 과한 로드맵이 없는 현실적인 프로젝트라 매력적인 것 같아요!",
    "로드맵도 담백하고 좋네요 게다가 프리민팅은 무조건 GO!",
    "신수 MBTI 테스트 같은 걸 만든 걸 보니 확실히 사람들을 어떻게 이끌 수 있는지 아는 팀이군요!",
    "P2E가 토크노믹스가 없으면 팥 없는 찐빵 아닌가...",
    "P2E는 진짜 늘 관심 갖게 되는 것 같은데, 신수는 더더욱 재밌어 보이는 거 같아요!",
  ];

  createComments();
}

function createComments() {
  document.querySelector(".section-title").innerHTML =
    "Comments [" + commentCount + "]";

  const parent = document.querySelector(".comment-inventory");

  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }

  for (let i = 0; i < commentCount; i++) {
    let el_wrapper = document.createElement("div");
    el_wrapper.setAttribute("class", "comment-item");

    let el_profile_wrapper = document.createElement("div");
    el_profile_wrapper.setAttribute("class", "comment-profile");

    let el_profile = document.createElement("img");
    el_profile.src = "img/commenter_profile.png";
    el_profile.alt = "Commenter Profile";

    let el_desc = document.createElement("div");

    let el_address = document.createElement("p");
    el_address.innerHTML = commenters[i].toUpperCase().substring(0, 8) + " 님";
    el_address.setAttribute("class", "wallet-address");

    let el_accumulated = document.createElement("p");
    el_accumulated.innerHTML = "작성한 코멘트 " + accumulatedComments[i] + "개";
    el_accumulated.setAttribute("class", "accumulated");

    let el_comment = document.createElement("p");
    el_comment.innerHTML = currentComments[i];
    el_comment.setAttribute("class", "comment-content");

    el_desc.appendChild(el_address);
    el_desc.appendChild(el_accumulated);

    el_profile_wrapper.appendChild(el_profile);
    el_profile_wrapper.appendChild(el_desc);

    el_wrapper.appendChild(el_profile_wrapper);
    el_wrapper.appendChild(el_comment);

    document.querySelector(".comment-inventory").appendChild(el_wrapper);
  }

  isLoading = false;
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

      if (!isLoading) {
        await loadComments();
      }
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
