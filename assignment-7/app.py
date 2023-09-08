"""
Assignment #7: AJAX
"""

from flask import Flask, request, g
import json

app = Flask(__name__)

def load_file(file):
    """Loads a list of albums from a file."""
    lines = []
    with open(file) as f:
        for line in f:
            lines.append(line)
    return lines


class Albums():
    """Class representing a collection of albums."""

    def __init__(self, albums_file, tracks_file):
        self.__albums = {}
        self.__album = {}
        self.albums_file = albums_file  
        self.tracks_file = tracks_file

    def get_albums(self):
        """Returns a list of all albums, with album_id, artist and title."""
        lines = self.albums_file
        for line in lines:
            albums_dict = {}
            (album_id, artist, album, cover) = line.strip().split('\t')
            albums_dict["album_id"] = album_id
            albums_dict["artist"] = artist
            albums_dict["album"] = album
            albums_dict["cover"] = cover
            self.__albums[album_id] = albums_dict
        return self.__albums

    def get_album(self, album_id_user):
        """Returns all details of an album."""
        albums_file = self.albums_file
        track_file = self.tracks_file

        dictionary = {}
        track_list = []

        for track in track_file:
            track_dict = {}
            (track_id, track, length) = track.strip().split('\t')
            if int(track_id) == album_id_user:
                track_dict["track"] = track
                track_dict["length"] = length
                track_list.append(track_dict)
        for album in albums_file:
            (album_id, artist, album_title, cover) = album.strip().split('\t')
            if int(album_id) == album_id_user:
                dictionary["album_id"] = album_id
                dictionary["artist"] = artist
                dictionary["album_title"] = album_title
                dictionary["cover"] = cover
                dictionary["tracks"] = track_list

        return dictionary


# the Albums class is instantiated and stored in a config variable
# it's not the cleanest thing ever, but makes sure that the we load the text files only once
app.config["albums"] = Albums(load_file("data/albums.txt"), load_file("data/tracks.txt"))


@app.route("/albums")
def albums():
    """Returns a list of albums (with album_id, author, and title) in JSON."""
    albums = app.config["albums"]
    album_list = albums.get_albums()
    return json.dumps(album_list)


@app.route("/albuminfo", methods=["GET"])
def albuminfo():
    albums = app.config["albums"]
    album_id = int(request.args.get("album_id", None))
    if album_id:
        print("yyyuuuuuur")
        return albums.get_album(album_id)
    print("naaaaah")
    return ""


@app.route("/sample")
def sample():
    return app.send_static_file("index_static.html")


@app.route("/")
def index():
    return app.send_static_file("index.html")


if __name__ == "__main__":
    app.run()