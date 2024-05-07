// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBbJp3i_KI_jPvuhaFVfLnMx-8PBEgIbJc",
    authDomain: "software-engineering-2fe59.firebaseapp.com",
    databaseURL: "https://software-engineering-2fe59-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "software-engineering-2fe59",
    storageBucket: "software-engineering-2fe59.appspot.com",
    messagingSenderId: "245620506345",
    appId: "1:245620506345:web:fa364d6e4881cdc57bba78",
    measurementId: "G-BFCWVMB6PK"
  };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const storage = firebase.storage();
const database = firebase.database();

// Upload image function
function uploadImage() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const fileName = file.name;
    const description = document.getElementById('descriptionInput').value; // Add this line to capture the description

    const storageRef = storage.ref('images/' + fileName);
    const uploadTask = storageRef.put(file);

    uploadTask.then((snapshot) => {
        // Upload completed successfully, now store image URL, description, and initial voting counts in the database
        storageRef.getDownloadURL().then((url) => {
            const imageUrl = url;
            const imageRef = database.ref('images').push();
            imageRef.set({
                imageUrl: imageUrl,
                description: description, // Store the description
                yesCount: 0,
                noCount: 0
            }).then(() => {
                console.log('Image uploaded successfully.');
                displayImages();
            }).catch((error) => {
                console.error('Failed to store image in database:', error);
            });
        }).catch((error) => {
            console.error('Error getting download URL:', error);
        });
    }).catch((error) => {
        console.error('Failed to upload image:', error);
    });
}

// Display images function
// Display images function
function displayImages() {
    const imageContainer = document.getElementById('image-container');
    if (!imageContainer) {
        console.error('Image container not found.');
        return;
    }

    const imagesRef = database.ref('images');
    imagesRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const imageKey = childSnapshot.key; // Get the image key
            const imageUrl = childSnapshot.val().imageUrl;
            const description = childSnapshot.val().description;
            const yesCount = childSnapshot.val().yesCount;
            const noCount = childSnapshot.val().noCount;

            const imageContainerDiv = document.createElement('div');
            imageContainerDiv.classList.add('imageContainer');
            imageContainerDiv.setAttribute('data-key', imageKey); // Add the data-key attribute

            // Display the image
            const img = document.createElement('img');
            img.src = imageUrl;
            imageContainerDiv.appendChild(img);

            // Display the description
            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = description;
            imageContainerDiv.appendChild(descriptionElement);

            // Display voting information
            const votingInfo = document.createElement('div');
            votingInfo.classList.add('votingInfo'); // Add a class for easier selection
            votingInfo.innerHTML = `Yes: ${yesCount}, No: ${noCount}`;
            imageContainerDiv.appendChild(votingInfo);

            // Add voting buttons
            const voteButtons = document.createElement('div');
            voteButtons.innerHTML = `
                <button onclick="vote('${imageKey}', 'yes')">Yes</button>
                <button onclick="vote('${imageKey}', 'no')">No</button>
            `;
            imageContainerDiv.appendChild(voteButtons);

            imageContainer.appendChild(imageContainerDiv);
        });
    }).catch((error) => {
        console.error('Error getting images from database:', error);
    });
}



function vote(imageKey, choice) {
    const imageRef = database.ref('images/' + imageKey);
    imageRef.transaction((image) => {
        if (image) {
            if (choice === 'yes') {
                image.yesCount = image.yesCount ? image.yesCount + 1 : 1;
            } else if (choice === 'no') {
                image.noCount = image.noCount ? image.noCount + 1 : 1;
            }
        }
        return image;
    }).then((result) => {
        if (result.committed) {
            console.log('Vote recorded successfully.');
            // Update voting information for the specific image
            const votingInfo = document.querySelector(`#image-container [data-key="${imageKey}"] .votingInfo`);
            if (votingInfo) {
                votingInfo.innerHTML = `Yes: ${result.snapshot.val().yesCount}, No: ${result.snapshot.val().noCount}`;
            }
        } else {
            console.error('Transaction was not committed:', result.error);
        }
    }).catch((error) => {
        console.error('Failed to record vote:', error);
    });
}


// Trigger displayImages on page load
displayImages();
