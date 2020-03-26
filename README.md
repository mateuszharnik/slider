# Slider

This is a slider carousel build in HTML, CSS and JavaScript.

## How to use?

```javascript
const mySlider = new Slider({
  wrapper: document.querySelector(".wrapper"), //Required - wrapper for slider
  slides: [
    {
      image: "img1.jpeg", //Path to your image file
      header: "Title 1", //Header of slide
      content: "Lorem ipsum dolor..." //Content of slide
    },
    {
      image: "img2.jpeg", //Path to your image file
      header: "Title 2", //Header of slide
      content: "Lorem ipsum dolor..." //Content of slide
    }
  ], //Required - array of objects - minimum 2 elements
  dots: true || false, //Enable or disable dots - default is true
  buttons: true || false, //Enable or disable buttons - default is true
  auto: true || false, //Change slide automatically - default is true
  pause: 1000, //How long slide is active - default is 5000 milliseconds
  transitionTime: 300 //Time of animation - default is 400 milliseconds
});

mySlider.init(); //Initialisation
```
