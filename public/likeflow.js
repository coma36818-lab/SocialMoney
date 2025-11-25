
// FIREBASE SETUP
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL }
from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";
import { getFirestore, collection, addDoc, serverTimestamp }
from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAX1j0On74HzyDrwRIrnRIcZPHDICBN-M0",
  authDomain: "studio-8742723834-1421e.firebaseapp.com",
  projectId: "studio-8742723834-1421e",
  storageBucket: "studio-8742723834-1421e.firebasestorage.app",
  messagingSenderId: "665625375719",
  appId: "1:665625375719:web:d680c46b80cd64e3578342"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


// PREVIEW
const mediaFileInput = document.getElementById("mediaFile");
if(mediaFileInput) {
    mediaFileInput.addEventListener("change", (event) => {
        const f = event.target.files[0];
        if (!f) return;

        const preview = document.getElementById("preview");
        if(preview) {
            preview.style.display = "block";

            if (f.type.startsWith("video")) {
                preview.innerHTML = `<video controls style="width:100%;border-radius:10px;"><source src="${URL.createObjectURL(f)}"></video>`;
            } else if (f.type.startsWith("image")) {
                preview.innerHTML = `<img src="${URL.createObjectURL(f)}" style="width:100%;border-radius:10px;">`;
            } else {
                preview.innerHTML = `<audio controls src="${URL.createObjectURL(f)}"></audio>`;
            }
        }
    });
}


// SAVE POST
async function savePost(mediaUrl, mediaType, authorPhotoUrl, authorDescription, premium) {
    await addDoc(collection(db, "posts"), {
        mediaUrl,
        mediaType,
        authorPhotoUrl: authorPhotoUrl || null,
        authorDescription: authorDescription || null,
        likes: 0,
        premium: premium,
        timestamp: serverTimestamp()
    });
    alert("Pubblicato con successo!");
}


// FREE UPLOAD
window.uploadFree = async function() {
    const last = localStorage.getItem("lf_last_upload");
    const today = new Date().toDateString();

    if (last === today) {
        alert("Hai già usato l'upload gratis oggi.");
        return;
    }

    await processUpload(false);

    localStorage.setItem("lf_last_upload", today);
}


// UPLOAD PROCESS
async function processUpload(premium) {
    const file = document.getElementById("mediaFile")?.files[0];
    if (!file) return alert("Seleziona un file!");

    const authorPhoto = document.getElementById("authorPhoto")?.files[0];
    const desc = document.getElementById("authorDescription")?.value;

    const mediaPath = "media/" + Date.now() + "_" + file.name;
    const mediaRef = ref(storage, mediaPath);

    await uploadBytes(mediaRef, file);
    const mediaUrl = await getDownloadURL(mediaRef);

    let authorPhotoUrl = null;
    if (authorPhoto) {
        const authPath = "authors/" + Date.now() + "_" + authorPhoto.name;
        const authRef = ref(storage, authPath);
        await uploadBytes(authRef, authorPhoto);
        authorPhotoUrl = await getDownloadURL(authRef);
    }

    const mediaType = file.type.startsWith("video") ? "video" :
                      file.type.startsWith("image") ? "image" : "audio";

    await savePost(mediaUrl, mediaType, authorPhotoUrl, desc, premium);
}

window.uploadPost = async function(premium = false) {
    if (premium) {
        // Here you would integrate with a payment system to charge for a boosted post
        // For now, we'll just treat it as a premium post for demonstration
        console.log("Processing premium post...");
    }
    await processUpload(premium);
}

    