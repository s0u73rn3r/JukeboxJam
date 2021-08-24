var assert = require('assert');
import Playlist from '../src/models/Playlist';

describe('Playlist', function() {
  describe('Create Playlist', function() {
    it('Should create new playlist with PlaylistTitle: ExamplePlaylist, Image: null, Songs: null, userId: 1234', function() {
      const newPlaylist = new Playlist("ExamplePlaylist", null, null, 1234);
      assert.equal(newPlaylist.playlistTitle, "ExamplePlaylist");
      assert.equal(newPlaylist.image, null);
      assert.equal(newPlaylist.songs, null);
      assert.equal(newPlaylist.userID, 1234);
    });
  });
});