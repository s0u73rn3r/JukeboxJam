var assert = require('assert');
import Song from '../src/models/Song';

describe('Song', function() {
  describe('Create Song Object', function() {
    it('Should create new song with Title: RecordScratch, Artist: Jackson5, Album: Magic, Genre: Pop, Pathname: null', function() {
      const newSong = new Song("RecordScratch", "Jackson5", "Magic", "Pop", null);
      assert.equal(newSong.title, "RecordScratch");
      assert.equal(newSong.artist, "Jackson5");
      assert.equal(newSong.album, "Magic");
      assert.equal(newSong.genre, "Pop");
      assert.equal(newSong.pathname, null);
    });
  });
});