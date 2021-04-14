(() => {
  const app = {
    initialize () {
      // This function initialize the other functions
      console.log('1. Application started!');
      this.sortDataLineup();
      this.cacheElements();
      this.buildUI();
      this.registerListeners();
    },
    cacheElements () {
      // This function will cache all existing DOM elements
      console.log('2. cache all existing DOM elements!');
      this.$hamb = document.querySelector('.hamburger');
      this.$navig = document.querySelector('.navig');
      this.$filter = document.querySelector('.filter');
      this.$lineup = document.querySelector('.lineup');
      this.$showSelected = document.querySelector('.show-selected');
      this.$closeButton = document.querySelector('.close');
      this.$countdownTimer = document.querySelector('.countdown-timer');
      this.$socialMenu = document.querySelector('.social-menu');
    },
    buildUI () {
      // This function will build the user interface
      console.log('3. Build the user interface!');
      this.$navig.innerHTML = this.generateHTMLForNavig();
      this.$filter.innerHTML = this.generateHTMLForFilter();
      this.$lineup.innerHTML = this.generateHTMLForLineup();
      this.$closeButton.innerHTML = this.generateHTMLForCloseButton();
      setInterval(() => { this.ticking(); }, 1000);
      this.$socialMenu.innerHTML = this.generateHTMLForSocialMenu();
    },
    generateHTMLForNavig () {
      // This function will generate the HTML for the navigation menu
      let tempStr = '<ul class="navigation-bar">';
      navigation.map((heading) => {
        tempStr += `<li><a href="${heading.link}" target="_blank">${heading.name}</a></li>`;
        return tempStr;
      }).join('');
      tempStr += '</ul>';
      return tempStr;
    },
    generateHTMLForFilter () {
      // This function will generate the HTML for the filter menu
      const tempStr = '<ul class="filtering"><li class="filt black" data-day="everyDay">Overzicht A-Z</li><li class="filt" data-day="Donderdag">Donderdag</li><li class="filt" data-day="Vrijdag">Vrijdag</li><li class="filt" data-day="Zaterdag">Zaterdag</li><li class="filt" data-day="Zondag">Zondag</li><li class="filt" data-day="headliners">Headliners</li></ul>';
      return tempStr;
    },
    sortDataLineup () {
      // This function will sort the data lineUp alphabetically by artist name
      lineUp.sort((a, b) => {
        const artistA = a.artist.name.toUpperCase();
        const artistB = b.artist.name.toUpperCase();
        if (artistA < artistB) {
          return -1;
        } if (artistA > artistB) {
          return 1;
        }
        return 0;
      });
    },
    generateHTMLForLineup () {
      // This function will generate the HTML for all the line ups
      let tempStr = '';
      lineUp.map((element) => {
        tempStr += `<div class="show" data-id="${element.id}" data-day="${this.generateDayOfTheWeek(element.from)}" data-headline="${element.isHeadliner}"style="background-image: url(${element.artist.picture.small})"><h2>${element.artist.name}</h2> <p><span class="weekday">${this.generateDayOfTheWeek(element.from)}</span><span class="place">${element.place.name}</span></p></div>`;
        return tempStr;
      }).join();
      return tempStr;
    },
    generateDayOfTheWeek (time) {
      // This function will transform epoch time to the day of the week
      let day = new Date(time);
      day = day.getDay();
      let dayOfWeeks = '';
      switch (day) {
        case 0:
          dayOfWeeks = 'Zondag';
          break;
        case 1:
          dayOfWeeks = 'Maandag';
          break;
        case 2:
          dayOfWeeks = 'Dinsdag';
          break;
        case 3:
          dayOfWeeks = 'Woensdag';
          break;
        case 4:
          dayOfWeeks = 'Donderdag';
          break;
        case 5:
          dayOfWeeks = 'Vrijdag';
          break;
        case 6:
          dayOfWeeks = 'Zaterdag';
          break;
        default:
      }
      return dayOfWeeks;
    },
    generateHTMLForCloseButton () {
      // This function will generate the HTML for the close button
      const tempStr = '<img src="img/close_icon.svg" alt="close button"> ';
      return tempStr;
    },
    showNavigation () {
      // This function will show the navigation menu and the close button
      this.$navig.classList.toggle('showNavig');
      this.$hamb.classList.toggle('showClose');
    },
    registerListeners () {
      // This function will register the different event listeners
      // Event listener 1: listens if the hamburger menu is clicked
      this.$hamb.addEventListener('click', (event) => {
        this.showNavigation();
      });
      // Event listener 2: listens if one of the elements of the filter is clicked
      const $filterList = this.$filter.querySelectorAll('.filt');
      let $fil;
      for (let j = 0; j < $filterList.length; j++) {
        $fil = $filterList[j];
        $fil.addEventListener('click', (ev) => {
          this.removeBlackFromFilter($filterList);
          const target = ev.currentTarget;
          target.classList.add('black');
          const { day } = ev.target.dataset;
          this.showFilterLineup(day);
        });
      }
      // Event listener 3: listens if one of the line ups is clicked
      const $showList = this.$lineup.querySelectorAll('.show');
      let $show;
      for (let i = 0; i < $showList.length; i++) {
        $show = $showList[i];
        $show.addEventListener('click', (event) => {
          const id = event.target.dataset.id || event.target.parentNode.dataset.id;
          const a = this.showArtistById(id);
          this.showBoxDetails(a);
          document.querySelector('.overlay').style.display = 'block';
          document.body.classList.toggle('noScroll');
        });
      }
      // Event listener 4: listens if the close button is clicked
      this.$closeButton.addEventListener('click', (buttonEvent) => {
        this.$showSelected.innerHTML = '';
        document.querySelector('.overlay').style.display = 'none';
        document.body.classList.toggle('noScroll');
      });
    },
    showFilterLineup (day) {
      // This function will only show the line ups that match the value of the filter
      const $concertsHTML = this.$lineup.querySelectorAll('.show');
      $concertsHTML.forEach(($concert) => {
        const weekday = $concert.dataset.day;
        const { headline } = $concert.dataset;
        if (day !== 'everyDay' && day !== 'headliners') {
          if (day === weekday) {
            $concert.classList.remove('hidden');
          } else {
            $concert.classList.add('hidden');
          }
        } else if (day === 'headliners') {
          if (headline === 'true') {
            $concert.classList.remove('hidden');
          } else {
            $concert.classList.add('hidden');
          }
        } else {
          $concert.classList.remove('hidden');
        }
      });
    },
    removeBlackFromFilter ($filterList) {
      // This function will remove the black text color in the filter menu
      $filterList.forEach((filterItem) => {
        if (filterItem.classList.contains('black')) {
          filterItem.classList.remove('black');
        }
      });
    },
    showArtistById (id) {
      /* This function will return the object with the same id
      as the one that is passed with the function */
      return lineUp.find(artist => (artist.id === id));
    },
    showBoxDetails (line) {
      // This function will show the details of the clicked line up
      this.$showSelected.innerHTML = this.generateHTMLForDetail(line);
    },
    generateHTMLForDetail (line) {
      // This function will generate het HTML for the detail of the clicked line up
      let tempStr = '';
      tempStr += `<figure><img src="${line.artist.picture.large}" alt="${line.artist.name}">
        <figcaption><h2 class="artistName">${line.artist.name}</h2>
        <p class="timePlace"><span class="weekday">${this.generateDayOfTheWeek(line.from)}</span><span class="place">${line.place.name}</span></p></figcaption></figure>
        <p class="synopsis">${line.artist.synopsis}</p>
        <iframe width="1182" height="665" src="${line.artist.media.sourceId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <h3>Meer Weten?</h3>
        <ul><li><a href="${line.artist.social.website}" target="_blank"><img src="img/website_icon.svg" alt="website logo"></a></li>
        <li><a href="${line.artist.social.facebook}" target="_blank"><img src="img/facebook_icon.svg" alt="facebook logo"></a></li>
        <li><a href="${line.artist.social.twitter}" target="_blank"><img src="img/twitter_icon.svg" alt="twitter logo"></a></li>
        `;
      if (line.artist.social.instagram !== '') {
        tempStr += `<li><a href="${line.artist.social.instagram}" target="_blank"><img src="img/instagram_icon.svg" alt="instagram logo"></a></li></ul>`;
      }
      return tempStr;
    },
    generateDigitalClockAsString () {
      // This function will generate the HTML for the digital clock as a string
      let tempStr = '<p>';
      const target = 1625148000000;
      const now = new Date();
      const difference = target - now;
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      if (difference < 0) {
        return 'Het festival is begonnen!';
      }
      tempStr += `${this.toAmountOfDigits(days, 3)} DAGEN ${this.toAmountOfDigits(hours, 2)}H ${this.toAmountOfDigits(minutes, 2)}M ${this.toAmountOfDigits(seconds, 2)}S</p>`;
      return tempStr;
    },
    toAmountOfDigits (number, amount) {
      // This function will generate the amount of digits that every number needs
      let str = String(number);
      while (str.length < amount) {
        str = `0${str}`;
      }
      return str;
    },
    ticking () {
      // This function will make the clock thick
      this.$countdownTimer.innerHTML = this.generateDigitalClockAsString();
    },
    generateHTMLForSocialMenu () {
      // This function will generate the HTML for the social menu
      let tempStr = '<ul>';
      social.map((socialLink) => {
        tempStr += `<li><a href="${socialLink.link}" target="_blank"><img src="${socialLink.name}" alt="${socialLink.type} logo"></a></li>`;
        return tempStr;
      });
      tempStr += '</ul>';
      return tempStr;
    },
  };
  app.initialize();
})();
