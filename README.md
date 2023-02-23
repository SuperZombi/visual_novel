# Visual Novel Engine

### <a href="https://superzombi.github.io/visual_novel/editor">VN Editor</a>

### print(text, args)
```javascript
args - {
  next: _=>{}, // function

  choices: [
    {
      name: "choice1",
      condition: _=> {}, // if statement (not required)
      do: _=> {} // function
    },
    {
      name: "choice2", do: _=> {}
    }
  ],

  continue: _=>{} // function
}
```
`continue` allows you to merge branches after choices.

To exit from branch you need to call function `return_to()` and you will go to `continue`.

### background(image)
Sets background image to canvas.

### persona(image, id)
Adds a new person to the scene. (if this person already exists, it will be replaced by the person's image) <br/>
Id is a simply unique identifier for the person.

### init_love_level(id, value)
### change_love_level(id, value)
### get_love_level(id)
