

// Import the functions you need from the SDKs you need


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase,ref,update,child,get} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration





// Itune -API
var likedsongs = new Set();
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
                    
                      
                          // Like heart icon button
                        const likeButton = document.createElement('ic');
                        likeButton.classList.add('fas', 'fa-heart');
                        const likeCount = document.createElement('span');
                        likeCount.textContent = 'Add to favorite';
                        likeButton.addEventListener('click', function() {
                            likedsongs.add(result.trackName);
                            const likedsongsArray = Array.from(likedsongs);
                            console.log(likedsongsArray);

                            const user = auth.currentUser; // Get the current user;
                            if (user) {
                                update(ref(database, 'users/' + user.uid), {//upload the likedsongArray to firebase
                                    songname: likedsongsArray
                                }); 
                           }   
                        });


                        songname.textContent = result.trackName; // Use textContent instead of innerHTML for security
                        songlogo.src = result.artworkUrl100;
                        song.src = result.previewUrl;
                        song.controls = true;
                        //put all things into a item - like box
                        item.appendChild(songlogo);
                        item.appendChild(song);
                        item.appendChild(songname);
                        item.appendChild(likeButton);
                        item.appendChild(likeCount);
  
                        songContainer.appendChild(item);//put one item in the container of screen

                        item.addEventListener('click', function() {
                            const sterm = songname.textContent; // Use fsong directly as the search term
                            console.log(sterm);
                            const surl = `https://itunes.apple.com/search?term=${sterm}`;
                            const ssongContainer = document.querySelector('#fullsongcontainer'); // Use querySelector instead of getElementsByClassName
                            while (ssongContainer.firstChild) {
                                ssongContainer.removeChild(ssongContainer.firstChild);
                            }
                            fetch(surl)
                                .then((response) => response.json())
                                .then((data) => {
                                    if (!data.results || data.results.length === 0) {
                                        alert('Song not found');
                                    } else {
                                        const sartists = data.results;
                                        const sresult = sartists[0];
    
                                        const ssongname = document.createElement('p'); // Create a <p> element for song name 
                                        const sitem = document.createElement('sdivsongs'); // Create a <div> element
                                        const ssonglogo = document.createElement('img'); // Create an <img> element
                                        const ssong = document.createElement('audio');
    
                                        ssongname.textContent = sresult.trackName; // Use textContent instead of innerHTML for security
                                        ssonglogo.src = sresult.artworkUrl100;
                                        ssong.src = sresult.previewUrl;
                                        ssong.controls = true;
                                        
                                        sitem.appendChild(ssonglogo);
                                        sitem.appendChild(ssong);
                                        sitem.appendChild(ssongname);
                                       
                
                                        ssongContainer.appendChild(sitem);
                                        $('#fullsong').modal('show'); // for showing on popup without any button (song click -dynamic)
    
                                        console.log(sresult);
                                    }
                                })
                                .catch((error) => {
                                    console.error('Error fetching data:', error);
                                });
                            
                        });
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



// Fetching the data from Firebase

var songs = [];
var mysong = document.getElementById('myMusic'); 

mysong.addEventListener('click', function() {
    const dbref = ref(db);
   
    // Assuming `user` is defined elsewhere
    const user = auth.currentUser;
    if (user) {
        get(child(dbref, "users/" + user.uid + "/songname"))
            .then((snapshot) => {
                var favsongs = [];
                snapshot.forEach((childSnapshot) => {
                    favsongs.push(childSnapshot.val());
                });
                songs = favsongs; 
             
                // Display fetched songs on screen after clicking on mysong
                const fsongContainer = document.getElementById('fsongContainer');
                fsongContainer.innerHTML = ''; 
                songs.forEach((fsong) => {
                    const fitem = document.createElement('fsong');
                    const fsongname = document.createElement('a');
                    fsongname.textContent = fsong;
                    fitem.appendChild(fsongname);
                    fsongContainer.appendChild(fitem);

                    fitem.addEventListener('click', function() {
                        const pterm = fsong; // Use fsong directly as the search term
                        const purl = `https://itunes.apple.com/search?term=${pterm}`;
                        const psongContainer = document.querySelector('#fullsongcontainer'); // Use querySelector instead of getElementsByClassName
                        while (psongContainer.firstChild) {
                            psongContainer.removeChild(psongContainer.firstChild);
                        }
                        fetch(purl)
                            .then((response) => response.json())
                            .then((data) => {
                                if (!data.results || data.results.length === 0) {
                                    alert('Song not found');
                                } else {
                                    const partists = data.results;
                                    const presult = partists[0];

                                    const psongname = document.createElement('p'); // Create a <p> element for song name 
                                    const pitem = document.createElement('pdivsongs'); // Create a <div> element
                                    const psonglogo = document.createElement('img'); // Create an <img> element
                                    const psong = document.createElement('audio');

                                    psongname.textContent = presult.trackName; // Use textContent instead of innerHTML for security
                                    psonglogo.src = presult.artworkUrl100;
                                    psong.src = presult.previewUrl;
                                    psong.controls = true;
                                    
                                    pitem.appendChild(psonglogo);
                                    pitem.appendChild(psong);
                                    pitem.appendChild(psongname);
                                   
            
                                    psongContainer.appendChild(pitem);
                                    $('#fullsong').modal('show'); // for showing on popup without any button (song click -dynamic)

                                    console.log(presult);
                                }
                            })
                            .catch((error) => {
                                console.error('Error fetching data:', error);
                            });
                        console.log('Clicked on song:', fsong);
                    });

                });

               
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
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

const database = getDatabase(app);
const auth = getAuth();
const db = getDatabase();




document.addEventListener('DOMContentLoaded', function () {
    const toggleMenu = document.getElementById('toggleMenu');
    const menuContent = document.querySelector('.menuContent');
    const myMusicLink = document.getElementById('myMusic');
    const menuContentMusic = document.querySelector('#menuContentmusic'); // Corrected ID

    // Ensure the initial state is hidden
    menuContent.style.display = 'none';
    menuContentMusic.style.display = 'none';

    toggleMenu.addEventListener('click', function () {
        // Toggle the display property directly
        menuContent.style.display = (menuContent.style.display === 'none') ? 'block' : 'none';
    });

    myMusicLink.addEventListener('click', function () {
        // Toggle the display property directly for music menu content
        menuContentMusic.style.display = (menuContentMusic.style.display === 'none') ? 'block' : 'none';
    });
});


     

