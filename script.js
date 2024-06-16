// Initialize variables
let current_song = new Audio;
let play = document.querySelector("#play");
let songs;
let curr_Folder;

// Function to fetch HTML content
async function getHTMLContent(folder) {
    curr_Folder = folder ;
    let a = await fetch(`http://127.0.0.1:5500/Spotify/songs/${curr_Folder}/`);
    let responce = await a.text();
    let div = document.createElement("div");
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a");
    let song =[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            let folder = curr_Folder.trim();
            let songUrl = element.href.split(`/songs/${folder}/`)[1].split(".mp3")[0];
            song.push(songUrl.replaceAll("%20"," "));
        }
    }
    return song;
}



// Main function
async function main() {

    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async () => { // Use async function
            let selectedCardName = card.querySelector("#p1");
            let cardname = selectedCardName.innerHTML;
    
            songs = await getHTMLContent(encodeURIComponent(cardname));
            songplay(songs[0], true);
            play.src = "./image/play.png";
            
            // Display song list
            let song_listul = document.querySelector("main ul");
            song_listul.innerHTML = ``;
            songs.forEach(song => {
                let li = document.createElement("li");
                li.innerHTML = `<img id="music_img" src="./image/music_img.svg" alt="">
                <div class="music_info">
                    <div class="song-name1"><span id="song_name">${song}</span></div>
                </div>
                <div class="play_now">
                    <button>Play Now</button>
                </div>`;
                song_listul.append(li);
            });
    
            // Attach event listeners to song list
            let lis = song_listul.querySelectorAll("li");
            lis.forEach(li => {
                li.addEventListener("click", () => {
                    let songName = li.querySelector("#song_name").innerHTML;
                    songplay(songName);
                    play.src = "./image/pause.svg";
                });
            });
        });
    });
    
    // Function to play song
function songplay (songname , pause = false ){
    let play_bar_name = document.querySelector("#song_name2");
    current_song.src = `http://127.0.0.1:5500/Spotify/songs/${curr_Folder}/${songname}.mp3`;
    if(!pause){
        current_song.play();
    }
    play_bar_name.innerHTML = songname;
    current_song.volume = 1;
    document.querySelector(".circle2").style.left = 100 + "%";
}


    // Attach event listener to play/pause button
    play.addEventListener("click" , ()=>{
        if(current_song.paused){
            play.src = "./image/pause.svg";
            current_song.play();
        }else{
            play.src = "./image/play.png";
            current_song.pause();
        }
    });

    // Event listener for spacebar keydown
    document.addEventListener("keydown", function(event) {
        if (event.code === "Space") { // Check if the pressed key is the spacebar
            if (!current_song.paused) {
                play.src = "./image/play.png"; // Update play button src
                current_song.pause(); // Pause the song
            } else {
                play.src = "./image/pause.svg";
                current_song.play();
            }
        }
    });

    // Attach event listener to song progress bar
    document.querySelector(".music_length").addEventListener("click" , e =>{
        let persentage = (e.offsetX /e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle1").style.left = persentage + "%";
        current_song.currentTime = (persentage * current_song.duration)/100;
    });

    // Attach event listener to volume bar
    document.querySelector(".volbar").addEventListener("click" , e =>{
        let persentage = (e.offsetX /e.target.getBoundingClientRect().width);
        current_song.volume =persentage;
        document.querySelector(".circle2").style.left = persentage*100 + "%";
    });

    // Attach event listener to next button
    document.querySelector("#next").addEventListener("click", e => {
        let index = songs.indexOf(current_song.src.split(`/songs/${curr_Folder}/`)[1].split(".mp3")[0]);
        if (index + 1 < songs.length) {
            play.src = "./image/pause.svg";
            songplay(songs[index + 1]);
        }
    });

    // Attach event listener to back button
    document.querySelector("#back").addEventListener("click", e => {
        let index = songs.indexOf(current_song.src.split(`/songs/${curr_Folder}/`)[1].split(".mp3")[0]);
        if (index - 1 >= 0) {
            play.src = "./image/pause.svg";
            songplay(songs[index - 1]);
        }
    });

    // Attach event listener to hamburger button
    document.querySelector("#hamburger").addEventListener("click" ,e =>{
        document.querySelector(".left").style.left = "0%";
        document.querySelector("footer").style.left = "3px";
        document.querySelector("footer").style.position = "fixed";
        document.querySelector("#close").style.display = "block";
    });

    // Attach event listener to close button
    document.querySelector("#close").addEventListener("click" ,e =>{
        document.querySelector(".left").style.left = "-100%";
        document.querySelector("footer").style.left = "8px";
        document.querySelector("footer").style.position = "absolute";
        document.querySelector("#close").style.display = "none";
    });
}



// Function to convert seconds to minutes and seconds
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Event listener to update song progress
current_song.addEventListener("timeupdate" , () =>{
    let song_time = document.querySelector("#songtime")
    song_time.innerText =`${secondsToMinutesSeconds(current_song.currentTime)} / ${secondsToMinutesSeconds(current_song.duration)}` ;
    document.querySelector(".circle1").style.left = (current_song.currentTime/current_song.duration)*100 + "%";
});

// Call main function
main();
