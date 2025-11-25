
// This file is loaded as a module in likeflow/page.tsx

// FIREBASE SETUP
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAX1j0On74HzyDrwRIrnRIcZPHDICBN-M0",
  authDomain: "studio-8742723834-1421e.firebaseapp.com",
  projectId: "studio-8742723834-1421e",
  storageBucket: "studio-8742723834-1421e.appspot.com",
  messagingSenderId: "665625375719",
  appId: "1:665625375719:web:d680c46b80cd64e3578342"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// PREVIEW
const mediaFileInput = document.getElementById("mediaFile");
if (mediaFileInput) {
    mediaFileInput.addEventListener("change", (event) => {
        const f = event.target.files[0];
        if (!f) return;

        const preview = document.getElementById("preview");
        if (preview) {
            preview.style.display = "block";
            preview.innerHTML = ''; // Clear previous preview

            if (f.type.startsWith("video")) {
                const video = document.createElement('video');
                video.controls = true;
                video.style.width = '100%';
                video.style.borderRadius = '10px';
                const source = document.createElement('source');
                source.src = URL.createObjectURL(f);
                video.appendChild(source);
                preview.appendChild(video);
            } else if (f.type.startsWith("image")) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(f);
                img.style.width = '100%';
                img.style.borderRadius = '10px';
                preview.appendChild(img);
            } else if (f.type.startsWith('audio')) {
                const audio = document.createElement('audio');
                audio.controls = true;
                audio.src = URL.createObjectURL(f);
                preview.appendChild(audio);
            }
        }
    });
}

// SAVE POST
async function savePost(mediaUrl, mediaType, authorPhotoUrl, authorName, authorDescription, premium) {
    await addDoc(collection(db, "posts"), {
        mediaUrl,
        mediaType,
        authorPhotoUrl: authorPhotoUrl || null,
        authorName: authorName || 'Anonymous',
        authorDescription: authorDescription || null,
        likes: 0,
        premium: premium,
        timestamp: serverTimestamp()
    });
    alert("Pubblicato con successo!");
}

// UPLOAD PROCESS
async function processUpload(premium) {
    const mediaFile = document.getElementById("mediaFile").files[0];
    if (!mediaFile) return alert("Seleziona un file media!");

    const authorPhoto = document.getElementById("authorPhoto").files[0];
    const authorName = document.getElementById("authorName").value;
    const postDesc = document.getElementById("postDesc").value;

    try {
        const mediaPath = "media/" + Date.now() + "_" + mediaFile.name;
        const mediaRef = ref(storage, mediaPath);
        await uploadBytes(mediaRef, mediaFile);
        const mediaUrl = await getDownloadURL(mediaRef);

        let authorPhotoUrl = null;
        if (authorPhoto) {
            const authPath = "authors/" + Date.now() + "_" + authorPhoto.name;
            const authRef = ref(storage, authPath);
            await uploadBytes(authRef, authorPhoto);
            authorPhotoUrl = await getDownloadURL(authRef);
        }

        const mediaType = mediaFile.type.startsWith("video") ? "video" :
                          mediaFile.type.startsWith("image") ? "image" : "audio";

        await savePost(mediaUrl, mediaType, authorPhotoUrl, authorName, postDesc, premium);

    } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload fallito. Riprova.");
    }
}

// FREE UPLOAD
async function uploadFree() {
    const lastUpload = localStorage.getItem("lf_last_upload");
    const today = new Date().toDateString();

    if (lastUpload === today) {
        alert("Hai già usato l'upload gratis oggi.");
        return;
    }

    await processUpload(false);
    localStorage.setItem("lf_last_upload", today);
}


// Attach to window
window.uploadPost = (premium) => {
    if (premium) {
        // This would be where you trigger a paid/boosted upload
        // For now, we'll just treat it as a premium upload directly.
        // In a real app, you would integrate PayPal here.
        alert("Funzione Boost in arrivo! Per ora, il post verrà caricato come premium.");
        processUpload(true);
    } else {
        uploadFree();
    }
};

// Remove old global functions if they exist to avoid conflicts
if (window.uploadFree) {
    delete window.uploadFree;
}
if (window.savePost) {
    delete window.savePost;
}
if (window.processUpload) {
    delete window.processUpload;
}
