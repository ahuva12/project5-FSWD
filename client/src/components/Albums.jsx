import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './userContext';
import { useNavigate } from "react-router-dom";
import "../CSS/albums.css"; // Adjusted path to CSS/albums.css

function Albums(){
    const { current_user } = useContext(UserContext);
    const navigate = useNavigate();
    const [albums, setAlbums] = useState([]);
    const [searchCriterion, setSearchCriterion] = useState('serial');
    const [searchValue, setSearchValue] = useState('');
    const [selectedAlbumPhotos, setSelectedAlbumPhotos] = useState([]);
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);
    const [photoPage, setPhotoPage] = useState(1);
    const photosPerPage = 5;

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await fetch(`http://localhost:3000/albums/?userId=${current_user.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch albums');
                }
                const albumsData = await response.json();
                setAlbums(albumsData);
                console.log('Albums arrive from the DB:', albumsData);
            } catch (error) {
                console.error('Failed to fetch albums:', error);
            }
        };
        fetchAlbums();
    }, [current_user]);

    const getPhotosForAlbum = async (albumId, start) => {
        try {
            const response = await fetch(`http://localhost:3000/photos/?albumId=${albumId}&_start=${start}&_limit=${photosPerPage}`);
            if (!response.ok) {
                throw new Error('Failed to fetch photos');
            }
            const photosData = await response.json();
            return photosData;
        } catch (error) {
            console.error('Failed to get photos from the DB:', error);
        }
    };

    async function add_album(album) {
        try {
            const response = await fetch(`http://localhost:3000/albums/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(album),
            });
            if (response.ok) {
                setAlbums([...albums, album]);
            }

        } catch (error) {
            console.error('Failed to update album in DB:', error);
        }
    }

    async function update_img(img) {
        console.log(img);
        try {
            const response = await fetch(`http://localhost:3000/photos/${img.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(img),
            });
            if (response.ok) {
                setSelectedAlbumPhotos(prevPhotos =>
                    prevPhotos.map(p =>
                        p.id === img.id ? img : p
                    )
                );
            }
        } catch (error) {
            console.error('Failed to update img in DB:', error);
        }
    }

    async function delete_img(imgID) {
        console.log(imgID)
        try {
            const response = await fetch(`http://localhost:3000/photos/${imgID}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setSelectedAlbumPhotos((prevImgs) => prevImgs.filter(img => img.id !== imgID));
            }
        } catch (error) {
            console.error('Failed to delete image:', error);
        }
    }

    async function add_img(img) {
        try {
            const response = await fetch(`http://localhost:3000/photos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(img),
            });
            if (response.ok) {
                setSelectedAlbumPhotos([...selectedAlbumPhotos, img]);
            }

        } catch (error) {
            console.error('Failed to add image to DB:', error);
        }
    }

    const loadMorePhotos = async (e) => {
        e.preventDefault();
        if (selectedAlbumId) {
            try {
                const morePhotos = await getPhotosForAlbum(selectedAlbumId, photoPage * photosPerPage);
                setSelectedAlbumPhotos((prevPhotos) => [...prevPhotos, ...morePhotos]);
                setPhotoPage((prevPage) => prevPage + 1);
            } catch (error) {
                console.error('Failed to load more photos:', error);
            }
        }
    };

    const handleAlbumClick = async (albumId) => {
        if (selectedAlbumId === albumId) {
            setSelectedAlbumId(null);
            setSelectedAlbumPhotos([]);
        } else {
            setPhotoPage(1);
            const photos = await getPhotosForAlbum(albumId, 0);
            setSelectedAlbumPhotos(photos);
            setSelectedAlbumId(albumId);
        }
    };

    const filterAlbums = (criterion, value) => {
        if (!value) return albums;

        switch (criterion) {
            case 'serial':
                return albums.filter(album => album.id.toString() === value);
            case 'title':
                return albums.filter(album => album.title.toLowerCase().includes(value.toLowerCase()));
            default:
                return albums;
        }
    };

    const hidePhotos = () => {
        setSelectedAlbumPhotos([]);
        setSelectedAlbumId(null);
        setPhotoPage(1);
    };

    function handleUpdateImg(e, id) {
        e.preventDefault();
        const form = e.target.closest('form');
        const title = form.elements['title'].value.trim();
        const url = form.elements['url'].value.trim();
        const thumbnailUrl = form.elements['thumbnailUrl'].value.trim();

        let updateImg = {
            albumId: selectedAlbumId,
            id: id,
            title: title,
            url: url,
            thumbnailUrl: thumbnailUrl
        };
        update_img(updateImg);
    }

    function handleDeleteImg(e, id) {
        e.preventDefault();
        delete_img(id);
    }

    function handleAddImg(e) {
        e.preventDefault();
        const form = e.target.closest('form');
        const title = form.elements['title'].value.trim();
        const url = form.elements['url'].value.trim();
        const thumbnailUrl = form.elements['thumbnailUrl'].value.trim();

        let newImg = {
            albumId: selectedAlbumId,
            id: `${(2 ** parseInt(selectedAlbumId)) * (2 * (selectedAlbumPhotos.length + 1) + 4994)}`,
            title: title,
            url: url,
            thumbnailUrl: thumbnailUrl
        };
        add_img(newImg);
        form.reset();
    }

    const renderPhotos = (photos) => {
        return (
            <ul>
                <form onSubmit={(e) => handleAddImg(e)}>
                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                        />
                    </label>
                    <br />
                    <label>
                        URL:
                        <input
                            type="text"
                            name="url"
                        />
                    </label>
                    <br />
                    <label>
                        Thumbnail URL:
                        <input
                            type="text"
                            name="thumbnailUrl"
                        />
                    </label>
                    <br />
                    <button type="submit">Add Img</button>
                </form>
                {photos.map((photo, index) => (
                    <li key={`${photo.id}-${index}`}>
                        <img src={photo.thumbnailUrl} alt={photo.title} />
                        <form onSubmit={(e) => handleUpdateImg(e, photo.id)}>
                            <label>
                                Title:
                                <input
                                    type="text"
                                    defaultValue={photo.title}
                                    name="title"
                                />
                            </label>
                            <br />
                            <label>
                                URL:
                                <input
                                    type="text"
                                    defaultValue={photo.url}
                                    name="url"
                                />
                            </label>
                            <br />
                            <label>
                                Thumbnail URL:
                                <input
                                    type="text"
                                    defaultValue={photo.thumbnailUrl}
                                    name="thumbnailUrl"
                                />
                            </label>
                            <br />
                            <button type="submit">Update Img</button>
                        </form>
                        <button onClick={(e) => handleDeleteImg(e, photo.id)}>Delete Img</button>
                    </li>
                ))}
            </ul>
        );
    };

    const filteredAlbums = filterAlbums(searchCriterion, searchValue);

    function handleAddAlbum(e) {
        e.preventDefault();
        const input = e.target.previousElementSibling;
        const albumTitle = input.value.trim();
        const newAlbum = {
            userId: parseInt(current_user.id),
            id: `${(2 ** parseInt(current_user.id)) * (2 * (albums.length + 1) + 94)}`,
            title: albumTitle,
        };
        add_album(newAlbum);
        input.value = '';
    }

    return (
        <div className="albums-container">
            <h2>User Albums:</h2>
            <br />
            <label>
                Search by:
                <select value={searchCriterion} onChange={(e) => setSearchCriterion(e.target.value)}>
                    <option value="serial">Serial</option>
                    <option value="title">Title</option>
                </select>
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Enter search value"
                />
            </label>
            <br />
            <label>
                Add New Album:
                <input
                    type="text"
                    placeholder="Enter Album title"
                />
                <button onClick={(e) => handleAddAlbum(e)}>Add Album</button>
            </label>
            <ul>
                {filteredAlbums.map((album, index) => (
                    <li key={`${album.id}-${index}`}>
                        <span>{album.id}. </span>
                        <strong>{album.title}</strong>
                        <br />
                        <a href="#" onClick={() => handleAlbumClick(album.id)}>
                            View Photos
                        </a>
                        {selectedAlbumId === album.id && selectedAlbumPhotos.length !== 0 && (
                            <>
                                {renderPhotos(selectedAlbumPhotos)}
                                <button onClick={loadMorePhotos}>Load More</button>
                                <button onClick={hidePhotos}>Hide Photos</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Albums;
