// Gallery page JavaScript
let currentPhotoIndex = 0;
let currentAlbumPhotos = [];

document.addEventListener('DOMContentLoaded', function() {
    loadGalleryAlbums();
    setupFilters();
});

function loadGalleryAlbums() {
    const albums = getFromLocalStorage('galleryAlbums') || [];
    displayAlbums(albums);
}

function displayAlbums(albums) {
    const container = document.getElementById('galleryAlbums');
    if (!container) return;
    
    if (albums.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No photo albums yet.</p>';
        return;
    }
    
    container.innerHTML = albums.map(album => `
        <div class="album-card" onclick="openAlbum(${album.id})">
            <img src="${album.coverImage}" alt="${album.eventName}" class="album-cover">
            <div class="album-info">
                <h3 class="album-title">${album.eventName}</h3>
                <p class="album-meta">
                    <i class="fas fa-images"></i> ${album.photos} photos &nbsp;
                    <i class="fas fa-eye"></i> ${album.views} views<br>
                    <i class="fas fa-calendar"></i> ${formatDate(album.date)} &nbsp;
                    <i class="fas fa-users"></i> ${album.club}
                </p>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    const galleryFilter = document.getElementById('galleryFilter');
    const clubFilter = document.getElementById('clubFilterGallery');
    
    if (galleryFilter) {
        galleryFilter.addEventListener('change', applyFilters);
    }
    if (clubFilter) {
        clubFilter.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    let albums = getFromLocalStorage('galleryAlbums') || [];
    
    const filter = document.getElementById('galleryFilter')?.value;
    const clubFilter = document.getElementById('clubFilterGallery')?.value;
    
    if (filter === 'recent') {
        albums.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (filter === 'popular') {
        albums.sort((a, b) => b.views - a.views);
    }
    
    if (clubFilter && clubFilter !== 'all') {
        albums = albums.filter(album => album.club.toLowerCase().includes(clubFilter.toLowerCase()));
    }
    
    displayAlbums(albums);
}

function openAlbum(albumId) {
    const albums = getFromLocalStorage('galleryAlbums') || [];
    const album = albums.find(a => a.id === albumId);
    
    if (!album) return;
    
    // Increment views
    album.views++;
    saveToLocalStorage('galleryAlbums', albums);
    
    // Generate sample photos for the album
    currentAlbumPhotos = generateAlbumPhotos(album);
    currentPhotoIndex = 0;
    
    showPhotoViewer();
}

function generateAlbumPhotos(album) {
    // Generate sample photos based on the album
    const photos = [];
    const baseImages = [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'
    ];
    
    for (let i = 0; i < Math.min(album.photos, 10); i++) {
        photos.push({
            url: baseImages[i % baseImages.length],
            title: `${album.eventName} - Photo ${i + 1}`,
            description: `Captured during ${album.eventName} on ${formatDate(album.date)}`
        });
    }
    
    return photos;
}

function showPhotoViewer() {
    const modal = document.getElementById('photoViewerModal');
    if (!modal) return;
    
    updatePhotoDisplay();
    modal.style.display = 'flex';
}

function closePhotoViewer() {
    const modal = document.getElementById('photoViewerModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function updatePhotoDisplay() {
    if (currentAlbumPhotos.length === 0) return;
    
    const photo = currentAlbumPhotos[currentPhotoIndex];
    
    document.getElementById('viewerImage').src = photo.url;
    document.getElementById('photoTitle').textContent = photo.title;
    document.getElementById('photoDescription').textContent = photo.description;
}

function previousPhoto() {
    if (currentPhotoIndex > 0) {
        currentPhotoIndex--;
        updatePhotoDisplay();
    }
}

function nextPhoto() {
    if (currentPhotoIndex < currentAlbumPhotos.length - 1) {
        currentPhotoIndex++;
        updatePhotoDisplay();
    }
}

function openUploadModal() {
    const user = getCurrentUser();
    if (!user || user.role !== 'organizer') {
        alert('Only organizers can upload photos!');
        return;
    }
    
    const modal = document.getElementById('uploadModal');
    if (modal) {
        // Populate event dropdown
        populateEventDropdown();
        modal.style.display = 'flex';
    }
}

function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('uploadForm').reset();
        document.getElementById('uploadPreview').innerHTML = '';
    }
}

function populateEventDropdown() {
    const select = document.getElementById('uploadEvent');
    if (!select) return;
    
    const events = getFromLocalStorage('events') || [];
    const today = new Date();
    
    // Get past events
    const pastEvents = events.filter(event => new Date(event.date) < today);
    
    select.innerHTML = '<option value="">Choose an event</option>' + 
        pastEvents.map(event => `
            <option value="${event.id}">${event.title} - ${formatDate(event.date)}</option>
        `).join('');
}

// Setup upload form
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handlePhotoUpload);
    }
    
    const photoFiles = document.getElementById('photoFiles');
    if (photoFiles) {
        photoFiles.addEventListener('change', handleFileSelect);
    }
});

function handleFileSelect(e) {
    const files = e.target.files;
    const preview = document.getElementById('uploadPreview');
    
    preview.innerHTML = '';
    
    for (let i = 0; i < Math.min(files.length, 10); i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'preview-thumb';
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }
}

function handlePhotoUpload(e) {
    e.preventDefault();
    
    const eventId = document.getElementById('uploadEvent').value;
    const files = document.getElementById('photoFiles').files;
    
    if (!eventId) {
        alert('Please select an event!');
        return;
    }
    
    if (files.length === 0) {
        alert('Please select photos to upload!');
        return;
    }
    
    const events = getFromLocalStorage('events') || [];
    const event = events.find(e => e.id === parseInt(eventId));
    
    if (!event) return;
    
    // Create new album or update existing
    const albums = getFromLocalStorage('galleryAlbums') || [];
    let album = albums.find(a => a.eventId === event.id);
    
    if (album) {
        album.photos += files.length;
    } else {
        album = {
            id: Date.now(),
            eventId: event.id,
            eventName: event.title,
            club: event.club,
            date: event.date,
            photos: files.length,
            coverImage: event.image,
            views: 0
        };
        albums.push(album);
    }
    
    saveToLocalStorage('galleryAlbums', albums);
    
    alert(`Successfully uploaded ${files.length} photos!`);
    closeUploadModal();
    loadGalleryAlbums();
}

// Keyboard navigation for photo viewer
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('photoViewerModal');
    if (modal && modal.style.display === 'flex') {
        if (e.key === 'ArrowLeft') {
            previousPhoto();
        } else if (e.key === 'ArrowRight') {
            nextPhoto();
        } else if (e.key === 'Escape') {
            closePhotoViewer();
        }
    }
});
