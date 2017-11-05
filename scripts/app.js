var source = {
  el: '#app',

  data: {
    api: 'https://teamtreehouse.com/',
    errorMessage: '',
    profile: null,
    text: '',
    requestState: {
      uninitialized: 0,
      loading: 1,
      complete: 4,
    },
    requestStatus: {
      OK: 200,
      NOTFOUND: 404,
    },
    isLoading: false,
  },

  computed: {
    endpoint: function() {
      return ''.concat(this.api, this.query);
    },
    query: function() {
      return this.text.toLowerCase().trim().split(' ').join('') + '.json';
    },
  },

  watch: {
    errorMessage(message) {
      if(message.length === 0) {
        return;
      }

      setTimeout(this.clearError.bind(this), 1500);
    },
  },

  methods: {
    clearError: function() {
      this.errorMessage = '';
    },
    formatDate: function(date) {
      var date = new Date(date).toDateString().split(' ');

      return date[1] +  ' ' + date[2] + ', ' + date[3];
    },
    parsedPoints: function(points) {
      var parsed = [];

      Object.keys(points).forEach(function(point) {
        if (points[point] === 0 || point === 'total') {
          return;
        }

        parsed.push({ name: point, count: points[point] });
      });

      return parsed;
    },
    search: function() {
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = this.handleResponse.bind(this, xhr);

      xhr.open('GET', this.endpoint);
      xhr.send();
    },
    handleResponse: function(xhr) {
      var state = this.requestState;
      var status = this.requestStatus;

      this.toggleLoader();

      if (xhr.readyState === state.uninitialized) {
        this.log('uninitialized');
        this.toggleLoader(false);

        return;
      }

      if (xhr.readyState === state.complete) {
        this.toggleLoader(false);

        if (xhr.status === status.OK) {
          this.saveProfile(xhr.response);
          return;
        }

        if (xhr.status === status.NOTFOUND) {
          this.errorMessage = 'no such name';

          return;
        }

        this.log('Error');
      }

      return;
    },
    restart() {
      this.profile = null;
      this.text = '';
    },
    saveProfile(response) {
      try {
        this.profile = JSON.parse(response);
      } catch (error) {
        this.log(error.message);
      }
    },
    toggleLoader(loading) {
      if (loading === undefined) {
        this.isLoading = true;
        return;
      }

      this.isLoading = loading;
    },
    log(message) {
      console.log(message);
    },
  },
};

document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM fully loaded and parsed");

  document.getElementById('loader').remove();
  document.getElementById('app').classList.remove('transparent');
});

var app = new Vue(source);
