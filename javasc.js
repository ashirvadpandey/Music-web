

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase,set,ref,update} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


// Itune -API

const updateTerm = () => {
    const term = document.getElementById('searchitem').value;
   
    // Check if term exists
    if (!term || term === '') {
        alert('Please enter a search term');
    } else {
        const url = `https://itunes.apple.com/search?term=${term}`;
        const songContainer = document.querySelector('.container'); // Use querySelector instead of getElementsByClassName
        while (songContainer.firstChild) {
            songContainer.removeChild(songContainer.firstChild);
        }
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (!data.results || data.results.length === 0) {
                    alert('Song not found');
                } else {
                 
                    const artists = data.results;
                    artists.forEach(result => {
                        const songname = document.createElement('p'); // Create a <p> element for song name 
                        const item = document.createElement('divsongs'); // Create a <div> element
                        const songlogo = document.createElement('img'); // Create an <img> element
                        const song = document.createElement('audio'); // Create an <audio> element
                        
                        songname.textContent = result.trackName; // Use textContent instead of innerHTML for security
                        songlogo.src = result.artworkUrl100;
                        song.src = result.previewUrl;
                        song.controls = true;
                        
                        item.appendChild(songlogo);
                        item.appendChild(song);
                        item.appendChild(songname);
                      
  
                        songContainer.appendChild(item);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
  };
  

const searchBtn = document.getElementById('searchbutton');
searchBtn.addEventListener('click', updateTerm);


// Send input by Enter keyword
document.getElementById("searchitem").addEventListener("keydown", function(event) {
    if (event.key === "Enter" && document.activeElement.id === "searchitem") {
        event.preventDefault(); // Prevent the default Enter behavior (form submission)
        document.getElementById("searchbutton").click();
    }
});

// remove login popup from background when forgetpasswd popup open
const forgetPassLink = document.getElementById("forgetpass");
const forgetPassModal = document.getElementById("forgetpasswd");
const loginModal = document.getElementById("mymodellogin"); // Replace with your actual login modal ID

if (forgetPassLink) {
    forgetPassLink.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default link behavior
        loginModal.style.display = "none"; // Hide the login modal
        forgetPassModal.style.display = "block"; // Show the forget password modal
    });
}





const firebaseConfig = {
    apiKey: "AIzaSyCohmVQGQEG5LZzLM-AqgZcAQoqkR7FsOs",
    authDomain: "music-auth-1329c.firebaseapp.com",
    databaseURL: "https://music-auth-1329c-default-rtdb.firebaseio.com",
    projectId: "music-auth-1329c",
    storageBucket: "music-auth-1329c.appspot.com",
    messagingSenderId: "1075480865502",
    appId: "1:1075480865502:web:3bb0854912760ac911304f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database=getDatabase(app);
const auth = getAuth();

//for signup
var submitsignupdata=document.getElementById('submitsignupdata');

if (submitsignupdata) {
    submitsignupdata.addEventListener('click', (e) => {
        //taking input from the input box
        var username = document.getElementById("usernamtext").value;
        var email = document.getElementById('emails').value;
        var password = document.getElementById('passwords').value; 
            
        //for firebox storing
        createUserWithEmailAndPassword(auth, email, password)                   
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                //storing the data into realtime 
                set(ref(database,'users/'+ user.uid),{
                    username: username,
                    email:email

                })
                alert("User Created");
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Please fill carefully!");
                // ..
            });
    });
}


//for login firebase
var submitlogindata=document.getElementById('submitlogindata')



if (submitlogindata) {
    submitlogindata.addEventListener('click', (e) => {
        //taking 
        var email = document.getElementById('emaill').value;
        var password = document.getElementById('passwordl').value; 

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                const dt = new Date();
                //updaing the realtime database of firebase
                update(ref(database, 'users/' + user.uid), {
                    last_login: dt,
                });
                
                alert("User logged in!");

                // Hide the signup and login button
                var signuplogo = document.getElementById('signbtn');
                var loginlogo = document.getElementById('loginbtn');
                signuplogo.style.display = "none";
                loginlogo.style.display='none';
               
                //opening the profile page of user after lognin
                window.location.href = "profile.html"; 
                
                
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Something went wrong!");
            });
    });
}
            
            

