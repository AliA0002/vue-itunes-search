const { createApp } = Vue

createApp({
  data() {
    return {
      searchTerm: "",
      allSongs: [],
      activeSongs: [],
      activeSongsOriginalSort: [],
      allGenres: [],
      activeGenres: [],
      numSongs: 0,
      searched: true,
      sortType: "reset"
    }
  },

  methods: {
    async Search() {
      const request = await fetch('https://itunes.apple.com/search?term=' + this.searchTerm + '&attribute=allArtistTerm' + '&limit=50');
      const { results } = await request.json();
      if (results.length == 0) {
        alert("Artist not found with keyword " + this.searchTerm);
      }
      console.log(results)
      this.allSongs = results;
      this.activeSongs = [...this.allSongs]
      this.activeSongsOriginalSort = [...this.activeSongs]
      this.numSongs = this.activeSongs.length
      this.activeGenres = ["All"]
      this.allGenres = []

      for (let i = 0; i < this.allSongs.length; ++i) {
        if (!this.allGenres.includes(this.allSongs[i].primaryGenreName)) {
          this.allGenres.push(this.allSongs[i].primaryGenreName)
        }
      }
      this.allGenres.unshift("All")
      searched = true
      console.log(this.allGenres)
    },

    genre_sort(genre) {
      if (genre === "All") {
        this.activeGenres = ["All"];
        tmp = [...this.allSongs];
        this.activeSongs = tmp;
        this.numSongs = this.activeSongs.length

        if (this.sortType === "price") {
          this.activeSongs.sort(function (a, b) {
            return a.trackPrice - b.trackPrice
          });
        }

        else if (this.sortType === "collection") {
          this.activeSongs.sort(function (a, b) {
            if (a.collectionName < b.collectionName) { return -1; }
            if (a.collectionName > b.collectionName) { return 1; }
            return 0;
          });
        }
      }
      else {
        if (this.activeGenres.includes(genre)) {
          this.activeGenres.splice(this.activeGenres.indexOf(genre), 1)
        }
        else {
          this.activeGenres.push(genre);
          if (this.activeGenres.includes("All")) {
            this.activeGenres.splice(this.activeGenres.indexOf("All"), 1);
          }
        }
        tmp = []
        for (let i = 0; i < this.allSongs.length; ++i) {
          if (this.activeGenres.includes(this.allSongs[i].primaryGenreName)) {
            tmp.push(this.allSongs[i]);
          }
        }
        this.activeSongs = tmp;
        this.numSongs = this.activeSongs.length;

        if (this.sortType === "price") {
          this.activeSongs.sort(function (a, b) {
            return a.trackPrice - b.trackPrice
          });
        }

        else if (this.sortType === "collection") {
          this.activeSongs.sort(function (a, b) {
            if (a.collectionName < b.collectionName) { return -1; }
            if (a.collectionName > b.collectionName) { return 1; }
            return 0;
          });
        }
      }
    },

    reset_sort() {
      let tmp = []
      for (let i = 0; i < this.activeSongsOriginalSort.length; ++i) {
        if (this.activeSongs.includes(this.activeSongsOriginalSort[i])) {
          tmp.push(this.activeSongsOriginalSort[i])
        }
      }
      this.activeSongs = tmp
      this.sortType = "reset"
    },

    price_sort() {
      this.activeSongs.sort(function (a, b) {
        return a.trackPrice - b.trackPrice
      });
      this.sortType = "price"
    },

    collection_sort() {
      this.activeSongs.sort(function (a, b) {
        if (a.collectionName < b.collectionName) { return -1; }
        if (a.collectionName > b.collectionName) { return 1; }
        return 0;
      });
      this.sortType = "collection"
    },

  }
}).mount('#app')


