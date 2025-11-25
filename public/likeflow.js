
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

// SAVE POST
async function savePost(mediaUrl, mediaType, authorName, authorPhotoUrl, postDesc) {
    await addDoc(collection(db, "posts"), {
        mediaUrl,
        mediaType,
        authorName: authorName || null,
        authorPhotoUrl: authorPhotoUrl || null,
        description: postDesc || null,
        likes: 0,
        premium: false, // Assuming all uploads via this simplified form are non-premium
        timestamp: serverTimestamp()
    });
    alert("Pubblicato con successo!");
}

// UPLOAD PROCESS
window.uploadPost = async function() {
    const file = document.getElementById("mediaFile").files[0];
    if (!file) {
        alert("Seleziona un file!");
        return;
    }

    const authorName = document.getElementById("authorName").value;
    const authorPhoto = document.getElementById("authorPhoto").files[0];
    const postDesc = document.getElementById("postDesc").value;

    const mediaPath = "media/" + Date.now() + "_" + file.name;
    const mediaRef = ref(storage, mediaPath);

    try {
        await uploadBytes(mediaRef, file);
        const mediaUrl = await getDownloadURL(mediaRef);

        let authorPhotoUrl = null;
        if (authorPhoto) {
            const authPath = "authors/" + Date.now() + "_" + authorPhoto.name;
            const authRef = ref(storage, authPath);
            await uploadBytes(authRef, authorPhoto);
            authorPhotoUrl = await getDownloadURL(authRef);
        }

        const mediaType = file.type.startsWith("video")
                            ? "video" :
                          file.type.startsWith("image")
                            ? "image" :
                            "audio";

        await savePost(mediaUrl, mediaType, authorName, authorPhotoUrl, postDesc);

    } catch (error) {
        console.error("Upload error:", error);
        alert("Si è verificato un errore durante il caricamento. Riprova.");
    }
}
