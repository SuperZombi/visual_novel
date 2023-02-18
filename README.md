# Visual Novel Engine

### print(text, args)
```javascript
args - {
  next: _=>{}, // function

  choices: {
    "choice1": _=>{}, // function
    "choice2": _=>{} // function
  },

  continue: _=>{} // function
}
```
`continue` allows you to merge branches after choices.

To exit from branch you need to call function `return_to()` and you will go to `continue`.

### background(image)
Sets background image to canvas.

### persona(image, id)
Adds a new person to the scene. (if this person already exists, it will be replaced by the person's image)

Id is a simply unique identifier for the person.
