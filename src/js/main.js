(function() {
  const Slider = (function() {
    function Slider(config) {
      if (!(this instanceof Slider)) {
        return new Slider(config);
      } else {
        const defaultConfig = {
          wrapper: document.body,
          slides: [],
          dots: true,
          buttons: true,
          auto: true,
          pause: 5000,
          transitionTime: 400
        };

        this.testConfig(config);
        this.wrapper = config.wrapper || defaultConfig.wrapper;
        this.wrapperWidth = this.wrapper.clientWidth;
        this.slides = config.slides || defaultConfig.slides;
        this.enableDots = typeof config.dots === 'boolean' ? config.dots : defaultConfig.dots;
        this.buttons = typeof config.buttons === 'boolean' ? config.buttons : defaultConfig.buttons;
        this.auto = typeof config.auto === 'boolean' ? config.auto : defaultConfig.auto;
        this.container = null;
        this.slider = null;
        this.sliderItems = [];
        this.dots = [];
        this.prevBtn = null;
        this.nextBtn = null;
        this.interval = null;
        this.currentImage = 0;
        this.currentDot = 0;
        this.transitionTime =
          typeof config.transitionTime === 'number' ? Math.round(config.transitionTime) : defaultConfig.transitionTime;
        this.pause =
          typeof config.pause === 'number'
            ? Math.round(config.pause) + this.transitionTime
            : defaultConfig.pause + this.transitionTime;
        this.transition = `all ${this.transitionTime}ms ease-in-out`;
      }
    }

    Slider.prototype.testConfig = function(config) {
      if (!(config instanceof Object)) {
        throw new Error('Argument must be object');
      }

      if (!(config.wrapper instanceof HTMLDivElement)) {
        throw new Error('Wrapper must be div element');
      }

      if (!Array.isArray(config.slides) || config.slides.length < 2) {
        throw new Error('Slides must be type of array and must have minimum 2 elements');
      } else {
        config.slides.forEach(obj => {
          if (typeof obj !== 'object') {
            throw new Error('Every element in images array must be type of object');
          }
        });
      }
    };

    Slider.prototype.createContainer = function() {
      this.container = document.createElement('div');
      this.container.classList.add('slider-container');
      this.wrapper.appendChild(this.container);
    };

    Slider.prototype.createSlider = function() {
      this.slider = document.createElement('ul');
      this.slider.classList.add('slider');
      this.container.appendChild(this.slider);
    };

    Slider.prototype.createSliderItems = function() {
      this.slides.forEach(slide => {
        const item = document.createElement('li');
        item.classList.add('slider-item');

        const slideBackground = typeof slide.image === 'string' ? `url(${slide.image})` : `transparent`;
        item.style.backgroundImage = slideBackground;

        const container = document.createElement('div');
        container.classList.add('slider-item-container');

        const title = document.createElement('h6');
        title.classList.add('slider-item-header');

        const slideTitle = typeof slide.header === 'string' ? `${slide.header}` : '';
        title.textContent = slideTitle;

        const content = document.createElement('p');
        content.classList.add('slider-item-content');

        const slideContent = typeof slide.content === 'string' ? `${slide.content}` : '';
        content.textContent = slideContent;

        item.appendChild(container);
        container.appendChild(title);
        container.appendChild(content);
        this.sliderItems.push(item);
      });
    };

    Slider.prototype.cloneFirstElement = function(element) {
      const elementCopy = element.cloneNode(true);
      this.slider.appendChild(elementCopy);
      this.sliderItems.push(elementCopy);
    };

    Slider.prototype.addItemsToSlider = function() {
      this.sliderItems.forEach(item => {
        this.slider.appendChild(item);
      });
    };

    Slider.prototype.setTransitionOnSlider = function() {
      this.slider.style.transition = this.transition;
    };

    Slider.prototype.setWidthOnElements = function() {
      this.width = this.wrapper.clientWidth;
      this.slider.style.width = `${this.width * this.sliderItems.length}px`;
      this.sliderItems.forEach(slide => {
        slide.style.width = `${this.width}px`;
      });
    };

    Slider.prototype.createButtons = function() {
      if (this.buttons === true) {
        this.prevBtn = document.createElement('button');
        this.prevBtn.classList.add('prev-btn');
        this.prevBtn.type = 'button';
        this.prevBtn.textContent = '<';

        this.nextBtn = document.createElement('button');
        this.nextBtn.classList.add('next-btn');
        this.nextBtn.type = 'button';
        this.nextBtn.textContent = '>';

        this.container.appendChild(this.prevBtn);
        this.container.appendChild(this.nextBtn);
      }
    };

    Slider.prototype.prevSlide = function() {
      this.currentImage--;
      if (this.currentImage < 0) {
        this.currentImage = this.sliderItems.length - 1;
        this.slider.style.transition = 'none';
        this.changeSlide(this.currentImage);
        setTimeout(() => {
          this.slider.style.transition = this.transition;
          this.currentImage--;
          this.changeSlide(this.currentImage);
          this.actualDot(-1);
        }, 100);
      } else {
        this.changeSlide(this.currentImage);
        this.actualDot(-1);
      }
    };

    Slider.prototype.nextSlide = function() {
      this.currentImage++;
      if (this.currentImage > this.sliderItems.length - 1) {
        this.currentImage = 0;
        this.slider.style.transition = 'none';
        this.changeSlide(this.currentImage);
        setTimeout(() => {
          this.slider.style.transition = this.transition;
          this.currentImage++;
          this.changeSlide(this.currentImage);
          this.actualDot(1);
        }, 100);
      } else {
        this.changeSlide(this.currentImage);
        this.actualDot(1);
      }
    };

    Slider.prototype.changeSlide = function(index) {
      this.slider.style.marginLeft = `-${this.width * index}px`;
    };

    Slider.prototype.throttle = function(callback, time) {
      let wait = false;
      return e => {
        if (!wait) {
          wait = true;
          callback.call(this, e);
          setTimeout(() => {
            wait = false;
          }, time + 100);
        }
      };
    };

    Slider.prototype.debounce = function(callback, time) {
      let timeout = null;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          callback.call(this);
        }, time);
      };
    };

    Slider.prototype.createDots = function() {
      if (this.enableDots === true) {
        const dotsContainer = document.createElement('div');
        dotsContainer.classList.add('dots-container');
        this.container.appendChild(dotsContainer);

        for (let i = 0; i < this.slides.length; i++) {
          const dot = document.createElement('span');
          dot.classList.add('dot');
          dotsContainer.appendChild(dot);

          this.dots.push(dot);
        }

        this.dots[0].classList.add('active');
      }
    };

    Slider.prototype.changeSlideByDot = function(e) {
      const index = this.dots.indexOf(e.target);

      for (let i = 0; i < this.dots.length; i++) {
        this.dots[i].classList.remove('active');
        if (index === i) {
          this.changeSlide(index);
          this.currentDot = index;
          this.currentImage = index;
          this.dots[i].classList.add('active');
        }
      }
    };

    Slider.prototype.actualDot = function(operation) {
      if (this.enableDots === true) {
        this.dots.forEach(dot => {
          dot.classList.remove('active');
        });

        if (operation === -1) {
          this.currentDot--;
          if (this.currentDot < 0) {
            this.currentDot = this.dots.length - 1;
          }
          this.dots[this.currentDot].classList.add('active');
        } else if (operation === 1) {
          this.currentDot++;
          if (this.currentDot > this.dots.length - 1) {
            this.currentDot = 0;
          }
          this.dots[this.currentDot].classList.add('active');
        }
      }
    };

    Slider.prototype.startInterval = function(time) {
      if (this.auto === true) {
        this.interval = setInterval(() => {
          this.nextSlide();
        }, time);
      }
    };

    Slider.prototype.stopInterval = function() {
      if (this.auto === true) {
        clearInterval(this.interval);
      }
    };

    Slider.prototype.checkEvent = function(e) {
      if (e.target.className === 'dot') {
        this.changeSlideByDot(e);
      } else if (e.target.className === 'prev-btn') {
        this.prevSlide();
      } else if (e.target.className === 'next-btn') {
        this.nextSlide();
      }
    };

    Slider.prototype.addEvents = function() {
      this.wrapper.addEventListener('click', this.throttle(this.checkEvent, this.transitionTime));
      window.addEventListener('resize', this.throttle(this.setWidthOnElements, 50));
      window.addEventListener('resize', this.debounce(this.setWidthOnElements, 50));
      this.wrapper.addEventListener('mouseenter', this.stopInterval.bind(this));
      this.wrapper.addEventListener('mouseleave', this.startInterval.bind(this, this.pause));
    };

    Slider.prototype.init = function() {
      this.createContainer();
      this.createSlider();
      this.createSliderItems();
      setTimeout(() => {
        this.cloneFirstElement(this.sliderItems[0]);
        this.addItemsToSlider();
        this.setTransitionOnSlider();
        this.setWidthOnElements();
        this.createButtons();
        this.createDots();
        this.startInterval(this.pause);
        this.addEvents();
      }, 100);
    };

    return Slider;
  })();

  const info = [
    {
      image: '', // Here is your path to the image
      header: 'Title1', // Here is your header
      content:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis nobis ad dolorum impedit dolor. Similique aut rerum, illum, enim veritatis alias, eum error neque voluptates non molestias distinctio praesentium labore.' // Here is your content
    },
    {
      image: '', // Here is your path to the image
      header: 'Title2', // Here is your header
      content:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis nobis ad dolorum impedit dolor. Similique aut rerum, illum, enim veritatis alias, eum error neque voluptates non molestias distinctio praesentium labore.' // Here is your content
    }
  ];

  const mySlider = new Slider({
    wrapper: document.querySelector('.wrapper'), // Required
    slides: info // Required
  });

  mySlider.init();
})();
