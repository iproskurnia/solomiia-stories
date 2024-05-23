let stories = [];
let favorites = [];

document.addEventListener('DOMContentLoaded', () => {
    loadStories();
    loadFavorites();
});

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });
}

async function generateStory() {
    const storyPrompt = document.getElementById('story-prompt').value;
    const imagePrompt = document.getElementById('image-prompt').value;
    const imageInput = document.getElementById('image');
    const formData = new FormData();

    formData.append('prompt', storyPrompt);
    if (imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
    }
    formData.append('imagePrompt', imagePrompt);

    try {
        const response = await fetch('/generate-story', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.story && data.imageUrl) {
            stories.push({ title: data.title, content: data.story, imageUrl: data.imageUrl });
            saveStories();
            updateStoryList();
        } else {
            alert('Не вдалося згенерувати казку');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Сталася помилка');
    }
}

function updateStoryList() {
    const storyList = document.getElementById('story-list');
    storyList.innerHTML = '';
    stories.forEach((story, index) => {
        const li = document.createElement('li');
        li.textContent = story.title;
        li.onclick = () => showStoryDetail(index);
        storyList.appendChild(li);
    });
}

function showStoryDetail(index) {
    const story = stories[index];
    document.getElementById('story-title').textContent = story.title;
    document.getElementById('story-content').textContent = story.content;
    const storyImg = document.getElementById('story-img');
    storyImg.src = story.imageUrl;
    storyImg.style.display = 'block';
    showSection('story-detail');
}

function addToFavorites() {
    const title = document.getElementById('story-title').textContent;
    const content = document.getElementById('story-content').textContent;
    const imageUrl = document.getElementById('story-img').src;
    const favorite = { title, content, imageUrl };
    favorites.push(favorite);
    saveFavorites();
    updateFavoriteList();
}

function updateFavoriteList() {
    const favoriteList = document.getElementById('favorite-stories');
    favoriteList.innerHTML = '';
    favorites.forEach((story, index) => {
        const li = document.createElement('li');
        li.textContent = story.title;
        li.onclick = () => showFavoriteDetail(index);
        favoriteList.appendChild(li);
    });
}

function showFavoriteDetail(index) {
    const story = favorites[index];
    document.getElementById('story-title').textContent = story.title;
    document.getElementById('story-content').textContent = story.content;
    const storyImg = document.getElementById('story-img');
    storyImg.src = story.imageUrl;
    storyImg.style.display = 'block';
    showSection('story-detail');
}

function printStory() {
    window.print();
}

function shareStory() {
    const url = window.location.href;
    const text = "Подивіться цю чудову казку для Соломії: ";
    const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    const instagramShare = `https://www.instagram.com/?url=${url}`;
    const telegramShare = `https://telegram.me/share/url?url=${url}&text=${text}`;
    window.open(facebookShare, '_blank');
    window.open(instagramShare, '_blank');
    window.open(telegramShare, '_blank');
}

function saveStories() {
    localStorage.setItem('stories', JSON.stringify(stories));
}

function loadStories() {
    const savedStories = localStorage.getItem('stories');
    if (savedStories) {
        stories = JSON.parse(savedStories);
        updateStoryList();
    }
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function loadFavorites() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
        updateFavoriteList();
    }
}
