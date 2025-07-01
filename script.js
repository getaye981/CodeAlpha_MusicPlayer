document.addEventListener('DOMContentLoaded', function() {
    // Music data
    const songs = [
        {
            title: "Blinding Lights",
            artist: "Zerubabel-Mola",
            cover: "image/getaye.jpg", // Your local image path
            source: "music/01_Zerubabel_MolaDJ_LUNA_REMIX_Giltun_Simign_@ETHIOREMIXER_ON_TELEGRAM.mp3",
            duration: "3:06"
        },
        {
            title: "Save Your Tears",
            artist: "Shewandagne",
            cover: "image/getaye.jpg",
            source: "music/02_Shewandagne_HailuDJ_LUNA_REMIX_Semta_Yehon_@ETHIOREMIXER_ON_TELEGRAM.mp3",
            duration: "02:34"
        },
        {
            title: "Starboy",
            artist: "UNO_X_JEMBERU",
            cover: "image/getaye.jpg",
            source: "music/03_UNO_X_JEMBERU_ft_YIZETDJ_LUNA_REMIX_FIRFIR_@ETHIOREMIXER_ON_TELEGRAM.mp3",
            duration: "02:45"
        },
        {
            title: "Take My Breath",
            artist: "Tamrat_Desta",
            cover: "image/getaye.jpg",
            source: "music/05_Tamrat_DestaDJ_LUNA_REMIX_Sew_Mekrosh_@ETHIOREMIXER_ON_TELEGRAM.mp3",
            duration: "3:27"
        },
        {
            title: "Die For You",
            artist: "Yirdaw_Tenaw",
            cover: "image/getaye.jpg",
            source: "music/06_Yirdaw_TenawDJ_LUNA_REMIX_Alemush_Emambo_@ETHIOREMIXER_ON_TELEGRAM.mp3",
            duration: "02:45"
        },
        {
            title: "Die For You",
            artist: "DagiD",
            cover: "image/getaye.jpg",
            source: "music/Dagi D_ .mp3",
            duration: "02:45"
        }
    ];

    // DOM elements
    const audio = new Audio();
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const coverImage = document.getElementById('cover-image');
    const progress = document.getElementById('progress');
    const progressContainer = document.getElementById('progress-container');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const volumeControl = document.getElementById('volume');
    const playlistEl = document.getElementById('playlist');
    const autoplayCheckbox = document.getElementById('autoplay');
    const shuffleCheckbox = document.getElementById('shuffle');

    // State variables
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffled = false;
    let isAutoplay = false;
    let shuffledPlaylist = [];

    // Initialize player
    function initPlayer() {
        loadSong(currentSongIndex);
        renderPlaylist();
    }

    // Load song
    function loadSong(index) {
        const song = isShuffled ? shuffledPlaylist[index] : songs[index];
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        coverImage.src = song.cover;
        audio.src = song.source;
        durationEl.textContent = song.duration;
    }

    // Play song
    function playSong() {
        isPlaying = true;
        playBtn.innerHTML = '<i>⏸</i>';
        audio.play();
        document.querySelector('.music-player').classList.add('music-playing');
    }

    // Pause song
    function pauseSong() {
        isPlaying = false;
        playBtn.innerHTML = '<i>▶</i>';
        audio.pause();
        document.querySelector('.music-player').classList.remove('music-playing');
    }

    // Previous song
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = (isShuffled ? shuffledPlaylist : songs).length - 1;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
        updateActivePlaylistItem();
    }

    // Next song
    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex >= (isShuffled ? shuffledPlaylist : songs).length) {
            currentSongIndex = 0;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
        updateActivePlaylistItem();
    }

    // Update progress bar
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        
        // Update current time
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) {
            currentSeconds = `0${currentSeconds}`;
        }
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
    }

    // Set progress
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    // Update volume
    function updateVolume() {
        audio.volume = volumeControl.value;
    }

    // Render playlist
    function renderPlaylist() {
        playlistEl.innerHTML = '';
        const playlistToRender = isShuffled ? shuffledPlaylist : songs;
        
        playlistToRender.forEach((song, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.classList.add('playlist-item');
            if (index === currentSongIndex) {
                playlistItem.classList.add('active');
            }
            playlistItem.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div class="playlist-item-info">
                    <div class="title">${song.title}</div>
                    <div class="artist">${song.artist}</div>
                </div>
            `;
            playlistItem.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
                updateActivePlaylistItem();
            });
            playlistEl.appendChild(playlistItem);
        });
    }

    // Update active playlist item
    function updateActivePlaylistItem() {
        const playlistItems = document.querySelectorAll('.playlist-item');
        playlistItems.forEach((item, index) => {
            if (index === currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Shuffle playlist
    function shufflePlaylist() {
        shuffledPlaylist = [...songs];
        for (let i = shuffledPlaylist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]];
        }
        currentSongIndex = shuffledPlaylist.findIndex(song => song.title === songs[currentSongIndex].title);
        if (currentSongIndex === -1) currentSongIndex = 0;
        renderPlaylist();
    }

    // Event listeners
    playBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
        if (isAutoplay) {
            nextSong();
        } else {
            pauseSong();
        }
    });

    progressContainer.addEventListener('click', setProgress);
    volumeControl.addEventListener('input', updateVolume);

    autoplayCheckbox.addEventListener('change', (e) => {
        isAutoplay = e.target.checked;
    });

    shuffleCheckbox.addEventListener('change', (e) => {
        isShuffled = e.target.checked;
        if (isShuffled) {
            shufflePlaylist();
        } else {
            renderPlaylist();
        }
    });

    // Initialize
    initPlayer();
});