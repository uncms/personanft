function goHome() {
  window.location.href = "/";
}

let nftDatas = [];
let urlSearch = null;
let nftID = 0;

window.addEventListener("load", async function () {
  nftDatas = [];
  nftDatas = JSON.parse(JSON.stringify(nftList));

  urlSearch = new URLSearchParams(location.search);

  nftID = parseInt(urlSearch.get("nft"));

  generateDetail(nftDatas[nftID]);

  web3 = new Web3(window.ethereum);

  const connection = await ethereum.request({ method: "eth_accounts" });

  if (connection.length) {
    await connectWallet();
  }
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

async function loadComments() {
  isLoading = true;

  await contractPersona.methods
    .getAllData(nftID)
    .call({
      from: account,
    })
    .then(function (res) {
      commenters = res[0];
      currentComments = res[1];
      accumulatedComments = res[2];
    })
    .catch(function (err) {
      console.log(err);
    });

  await createComments();
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
let contractPersona;

async function connectWallet() {
  contractPersona = new web3.eth.Contract(ABI, CONTRACTADDRESS);

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

      await getCommentCount();
      await canWriteComment();

      if (!isLoading && isCommented) {
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

let canComment = false;
let isCommented = false;

async function getCommentCount() {
  await contractPersona.methods
    .getCommentCount(nftID)
    .call({
      from: account,
    })
    .then(function (res) {
      commentCount = res;
      document.querySelector(".section-title").innerHTML =
        "Comments [" + res + "]";
    })
    .catch(function (err) {
      console.log(err);
    });
}

async function canWriteComment() {
  await contractPersona.methods
    .canWriteComment()
    .call({
      from: account,
    })
    .then(function (res) {
      canComment = res[0];
      if (parseInt(res[1]) > 0) {
        isCommented = true;
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

async function writeComment() {
  let result = null;
  const textareaComment = document.querySelector(".write-comment");

  if (canComment) {
    if (textareaComment.value.trim() != "") {
      result = await contractPersona.methods
        .writeComment(nftID, textareaComment.value.trim())
        .send({
          from: account,
          maxFeePerGas: 64000000000,
          maxPriorityFeePerGas: 32000000000,
        });
    } else {
      alert("코멘트를 작성해주세요! Please write a comment for this project!");
    }

    if (result != null) {
      alert(
        "정상적으로 코멘트가 온체인 상에 등록되었습니다! Your comment has been successfully registered on blockchain network!"
      );

      await getCommentCount();
      await canWriteComment();

      if (!isLoading) {
        await loadComments();
      }

      textareaComment.value = "";
    }
  } else {
    alert(
      "코멘트는 24시간 간격으로 작성하실 수 있습니다! You can write a comment every 24 hours!"
    );
  }
}

async function checkConnection() {
  if (account == null || isConnected == false) {
    alert(
      "메타마스크 지갑을 먼저 연결해주세요. Please connect your MetaMask to our website!"
    );
  }
}
