// -------------------------------
// FIREBASE INIT
// -------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

export const app = initializeApp({
    apiKey: "AIzaSyAX1j0On74HzyDrwRIrnRIcZPHDICBN-M0",
    authDomain: "studio-8742723834-1421e.firebaseapp.com",
    projectId: "studio-8742723834-1421e",
    storageBucket: "studio-8742723834-1421e.appspot.com",
});

export const db = getFirestore(app);
export const storage = getStorage(app);

// -------------------------------
// WALLET (LOCALSTORAGE)
// -------------------------------
export function getWallet() {
    return parseInt(localStorage.getItem("wallet") || "0");
}

export function addWallet(amount) {
    localStorage.setItem("wallet", getWallet() + amount);
    updateWalletUI();
}

export function useLike() {
    const w = getWallet();
    if (w <= 0) return false;
    localStorage.setItem("wallet", w - 1);
    updateWalletUI();
    return true;
}

export function updateWalletUI() {
    const el = document.getElementById("walletValue");
    if (el) el.innerText = getWallet();
}

// -------------------------------
// UPLOAD POST
// -------------------------------
async function uploadPost() {
    const fileInput = document.getElementById("mediaFile");
    if (!fileInput) return;
    const file = fileInput.files[0];
    if (!file) return alert("Carica un file!");

    const authorNameInput = document.getElementById("authorName");
    const authorName = authorNameInput ? authorNameInput.value : "";
    
    const postDescInput = document.getElementById("postDesc");
    const postDesc = postDescInput ? postDescInput.value : "";
    
    const authorPhotoInput = document.getElementById("authorPhoto");
    const authorPhotoFile = authorPhotoInput ? authorPhotoInput.files[0] : null;

    let authorPhotoURL = "";
    if (authorPhotoFile) {
        const apRef = ref(storage, "authors/" + Date.now() + "-" + authorPhotoFile.name);
        await uploadBytes(apRef, authorPhotoFile);
        authorPhotoURL = await getDownloadURL(apRef);
    }

    const mediaRef = ref(storage, "posts/" + Date.now() + "-" + file.name);
    await uploadBytes(mediaRef, file);
    const mediaURL = await getDownloadURL(mediaRef);

    await addDoc(collection(db, "posts"), {
        mediaURL,
        mediaType: file.type,
        authorName,
        authorPhoto: authorPhotoURL,
        postDesc,
        likes: 0,
        likesWeek: 0,
        timestamp: Date.now()
    });

    alert("Post pubblicato!");
    location.href = "/likeflow/feed";
}

window.uploadPost = uploadPost;

// -------------------------------
// LOAD FEED
// -------------------------------
async function loadFeed() {
    const container = document.getElementById("feedContainer");
    if (!container) return;

    const snap = await getDocs(collection(db, "posts"));
    container.innerHTML = "";

    snap.forEach(p => {
        const d = p.data();

        let mediaHTML = "";

        if (d.mediaType.startsWith("video"))
            mediaHTML = `<video class="post-media" src="${d.mediaURL}" autoplay muted loop></video>`;
        if (d.mediaType.startsWith("image"))
            mediaHTML = `<img class="post-media" src="${d.mediaURL}">`;
        if (d.mediaType.startsWith("audio"))
            mediaHTML = `<audio class="post-media" src="${d.mediaURL}" controls></audio>`;

        container.innerHTML += `
        <div class="post">
            ${mediaHTML}

            <div class="post-info">
                <img src="${d.authorPhoto || '/default-avatar.png'}" class="author-photo">
                <div class="author-name">${d.authorName || "Anonimo"}</div>
                <div class="post-desc">${d.postDesc || ""}</div>
            </div>

            <button class="like-btn" onclick="likePost('${p.id}', this)">
                ❤️ <span>${d.likes || 0}</span>
            </button>
        </div>`;
    });
}

if (window.location.pathname.endsWith('/feed')) {
    loadFeed();
    updateWalletUI();
}

// -------------------------------
// LIKE A POST
// -------------------------------
window.likePost = async function (postId, btn) {
    if (!useLike()) return alert("Non hai abbastanza like. Compra un pacchetto!");

    const span = btn.querySelector("span");
    const currentLikes = parseInt(span.innerText);
    const newLikes = currentLikes + 1;
    span.innerText = newLikes;

    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
        likes: newLikes,
        likesWeek: newLikes
    });
};
