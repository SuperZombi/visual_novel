window.onload = _=> main()

function changeTheme(){
	if (document.documentElement.classList.contains("dark")){
		document.documentElement.classList.remove("dark")
		window.location.hash = "#"
	} else{
		document.documentElement.classList.add("dark")
		window.location.hash = "#dark"
	}
}

function main(){
	if (window.location.hash.substr(1) == "dark"){
		document.documentElement.classList.add("dark")
	}

	document.querySelector("#new_file").onclick = newfile
	document.querySelector("#open").onclick = openfile
	document.querySelector("#saveAs").onclick = saveAs
	document.querySelector("#delete").onclick = delete_highlighted
	document.querySelector("#undo").onclick = undo_manager
	document.querySelector("#redo").onclick = redo_manager
	document.querySelector("#execute").onclick = execute
	document.querySelector("#editor").onclick = unselectAll

	document.addEventListener("keydown", e=>{
		if (e.ctrlKey && e.keyCode === 83) {
			e.preventDefault();
			saveAs();
		}
		if (e.ctrlKey && e.keyCode === 89) {
			redo_manager();
		}
		if (e.ctrlKey && e.keyCode === 90) {
			undo_manager();
		}
		else if (e.keyCode == 46){
			delete_highlighted()
		}
	})

	let old_content = window.localStorage.getItem("execute_from_file")
	if (old_content){
		displayContents(old_content)
	}
}

function execute(){
	let content = parseTree(document.querySelector("#editor"))
	window.localStorage.setItem("execute_from_file", content)
	window.location = "index.html?from_file=true"
}
function newfile(){
	if (document.querySelector("#editor").innerHTML != ""){
		if (confirm("Are you sure?")){
			document.querySelector("#editor").innerHTML = ""
		}
	}
	document.querySelector("#proj-name").value = ""
	window.localStorage.removeItem("execute_from_file")
}

document.addEventListener("chapter-loaded", e=>{
	try{
		e.detail.start()
	} catch (e){
		alert(e)
	}
})

function openfile(){
	var input = document.createElement('input');
	input.type = 'file';
	input.accept = ".vnp.js,.js"
	input.onchange = e=>{ 
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			var contents = e.target.result;
			if (contents.startsWith("//")){
				let params = JSON.parse(contents.split('\n')[0].replace("//", ""))
				if (params.name){
					document.querySelector("#proj-name").value = params.name
				}
			}
			displayContents(contents);
		};
		reader.readAsText(file);
	}
	input.click();
}
function displayContents(text){
	var F = new Function (text);
	try{
		current = document.querySelector("#editor")
		current.innerHTML = ""
		redo_stack = [];
		undo_stack = [];
		F()
	} catch (e){
		alert(e)
	}
}


function background(image){
	let div = document.createElement("div")
	div.setAttribute("onclick", "highlight_to_edit(this)")
	div.setAttribute("before", "background")
	div.className = "simple-block light"
	let input = document.createElement("input")
	input.value = image
	input.placeholder = "image"
	div.appendChild(input)
	current.appendChild(div)
}

var current;
function print(text, args){
	let div = document.createElement("div")
	div.setAttribute("before", "print")
	div.className = "simple-block"
	div.setAttribute("onclick", "highlight_to_edit(this)")
	let input = document.createElement("input")
	input.value = text.replace(/\n/g, '\\n')
	div.appendChild(input)
	current.appendChild(div)
	if (args){
		if (args.choices){
			let main_div = document.createElement("div")
			main_div.className = "choices"
			current.appendChild(main_div)
			args.choices.forEach(choice=>{
				current = main_div
				let div = document.createElement("div")
				div.className = "choice"
				let subdiv = document.createElement("div")
				subdiv.className = "choice-title"
				subdiv.setAttribute("onclick", "highlight_to_edit(this)")
				let input = document.createElement("input")
				input.name = "name"
				input.placeholder = "name"
				input.value = choice.name
				let input2 = document.createElement("input")
				input2.name = "condition"
				input2.placeholder = "condition"
				if (choice.condition){
					const regex = /{([^}]+)}/;
					let match = regex.exec(choice.condition);
					input2.value = match[1].trim()
				}
				subdiv.appendChild(input)
				subdiv.appendChild(input2)
				div.appendChild(subdiv)
				let tail = document.createElement("div")
				tail.className = "choice-tail"
				div.appendChild(tail)
				current.appendChild(div)
				current = tail
				choice.do()
			})
			current = main_div.parentNode
		}
		if (args.continue){
			args.continue()
		}
		else if (args.next){
			args.next()
		}
	}
}

function progress(val){
	let div = document.createElement("div")
	div.setAttribute("before", "progress")
	div.className = "simple-block"
	div.style.setProperty("background", "orange")
	div.setAttribute("onclick", "highlight_to_edit(this)")
	let input = document.createElement("input")
	input.value = val
	input.type = "number"
	input.min = 0
	input.max = 100
	input.style.width = "40px"
	div.appendChild(input)
	current.appendChild(div)
}
function return_to(){}
function go_to_menu(){
	let div = document.createElement("div")
	div.setAttribute("before", "go_to_menu")
	div.className = "simple-block"
	div.style.setProperty("background", "#ff4040")
	div.setAttribute("onclick", "highlight_to_edit(this)")
	current.appendChild(div)
}
function get_love_level(id){}
function love_lvl_build(name, id, value, title=null){
	let div = document.createElement("div")
	div.setAttribute("onclick", "highlight_to_edit(this)")
	div.setAttribute("before", name)
	div.className = "simple-block love"
	if (name == "init_love_level"){
		let input = document.createElement("input")
		input.name = "name"
		input.placeholder = "name"
		input.value = title
		div.appendChild(input)
	}
	let input2 = document.createElement("input")
	input2.name = "id"
	input2.placeholder = "ID"
	input2.value = id
	div.appendChild(input2)
	let input3 = document.createElement("input")
	input3.style.width = "40px"
	input3.name = "value"
	input3.placeholder = "value"
	input3.value = value
	input3.type = "number"
	if (name == "init_love_level"){
		input3.min = 0
		input3.max = 10
	}
	div.appendChild(input3)
	current.appendChild(div)
}
function change_love_level(id, value){love_lvl_build("change_love_level", id, value)}
function init_love_level(name, id, value){love_lvl_build("init_love_level", id, value, name)}
function persona(name, id){
	let div = document.createElement("div")
	div.setAttribute("onclick", "highlight_to_edit(this)")
	div.setAttribute("before", "persona")
	div.className = "simple-block persona"
	let input = document.createElement("input")
	input.name = "name"
	input.placeholder = "image"
	input.value = name
	div.appendChild(input)
	let input2 = document.createElement("input")
	input2.style.width = "50px"
	input2.name = "id"
	input2.placeholder = "ID"
	input2.value = id
	div.appendChild(input2)
	current.appendChild(div)
}


function saveAs(){
	const link = document.createElement("a");
	let content = ""
	let file_name = "project.vnp.js"
	let params = {}
	if (document.querySelector("#proj-name").value.trim()){
		params.name = document.querySelector("#proj-name").value.trim()
		file_name = document.querySelector("#proj-name").value.trim() + ".js"
	}
	if (Object.keys(params).length > 0){
		content += "// " + JSON.stringify(params) + "\n"
	}
	content += js_beautify(parseTree(document.querySelector("#editor")));
	const file = new Blob([content], { type: 'text/plain' });
	link.href = URL.createObjectURL(file);
	link.download = file_name;
	link.click();
	URL.revokeObjectURL(link.href);
}
function parseTree(tree, main=true){
	let TEXT = "";
	let close_after = "";
	let arr = tree.querySelectorAll(":scope > *")
	arr.forEach(div=>{
		if (div.className == "choices"){
			let choices = div.querySelectorAll(":scope > .choice")
			choices.forEach(choice=>{
				let name = choice.querySelector(":scope > .choice-title > input[name=name]").value
				let condition = choice.querySelector(":scope > .choice-title > input[name=condition]").value
				let tail = choice.querySelector(":scope > .choice-tail")
				let subtext = `\n {name: "${name}",`
				subtext += `${(condition) ? (` condition: _=> { ${condition} },`) : ""}`
				subtext += `\n do: _=> { ${parseTree(tail, false)} }},`
				TEXT += subtext;
			})
			TEXT += `],\n continue: _=> { `
		}
		else{
			if (div.getAttribute("before") == "print"){
				if (div.nextElementSibling && div.nextElementSibling.classList.contains("choices")){
					TEXT += `print("${div.querySelector("input").value}", {\n choices: [ `
					close_after += '}})'
				}
				else if (div.nextElementSibling){
					TEXT += `print("${div.querySelector("input").value}", {\n next: _=> { `
					close_after += '}})'
				}
				else{
					if (div.parentElement.classList.contains("choice-tail")){
						TEXT += `print("${div.querySelector("input").value}", {\n next: _=> { `
						close_after += '}})'
					} else{
						TEXT += `print("${div.querySelector("input").value}"); `
					}
				}

			}
			else if (div.getAttribute("before") == "persona"){
				TEXT += `${div.getAttribute("before")}("${div.querySelector("input[name=name]").value}", "${div.querySelector("input[name=id]").value}"); `
			}
			else if (div.getAttribute("before") == "init_love_level"){
				TEXT += `${div.getAttribute("before")}("${div.querySelector("input[name=name]").value}", "${div.querySelector("input[name=id]").value}", ${div.querySelector("input[name=value]").value}); `
			}
			else if (div.getAttribute("before") == "change_love_level"){
				TEXT += `${div.getAttribute("before")}("${div.querySelector("input[name=id]").value}", ${div.querySelector("input[name=value]").value}); `
			}
			else{
				if (div.querySelector("input")){
					if (isNaN(div.querySelector("input").value) || div.querySelector("input").value.trim() == ""){
						TEXT += `${div.getAttribute("before")}("${div.querySelector("input").value}"); `
					} else{
						TEXT += `${div.getAttribute("before")}(${div.querySelector("input").value}); `
					}
				} else{
					TEXT += `${div.getAttribute("before")}(); `
				}
			}
			
		}
	})

	if (main){
		return TEXT + close_after
	} else{ return TEXT + "return_to();" + close_after }
}


function unselectAll(event){
	document.querySelectorAll("#editor .selected").forEach(e=>{
		e.classList.remove("selected")
	})
}
function highlight_to_edit(element){
	document.querySelector("#love-lvl").style.display = "none"
	document.querySelectorAll("#editor .selected").forEach(e=>{
		e.classList.remove("selected")
	})
	setTimeout(_=>{
		element.classList.add("selected")
		if (element.classList.contains("choice-title")){
			document.querySelector("#love-lvl").style.display = "block"
		}
	}, 0)
}
function delete_highlighted(){
	let el = document.querySelector("#editor .selected")
	if (el){
		let elem_to_remove;
		if (el.classList.contains("choice-title")){
			if (el.parentNode.parentNode.querySelectorAll(":scope > *").length == 1){
				elem_to_remove = el.parentNode.parentNode
			} else{
				elem_to_remove = el.parentNode
			}
		} else{
			elem_to_remove = el
		}
		undo_stack.push({el: elem_to_remove.cloneNode(true),
						prev: elem_to_remove.previousElementSibling,
						next:  elem_to_remove.nextElementSibling})
		elem_to_remove.remove()
	}
}

var undo_stack = [];
function undo_manager(){
	if (undo_stack.length > 0){
		let history = undo_stack.pop()
		if (document.body.contains(history.prev)){
			history.prev.after(history.el)
		} else{
			history.next.before(history.el)
		}
		redo_stack.push(history.el)
	} else{
		document.execCommand('undo', false, null);
	}
}
var redo_stack = [];
function redo_manager(){
	if (redo_stack.length > 0){
		let history = redo_stack.pop()
		highlight_to_edit(history)
		setTimeout(_=>{delete_highlighted()}, 0)
	} else{
		document.execCommand('redo', false, null);
	}
}


function addNode(name, prepend=false){
	function makeChoice(){
		let subdiv = document.createElement("div")
		subdiv.className = "choice"
		let subdiv2 = document.createElement("div")
		subdiv2.className = "choice-title"
		let input = document.createElement("input")
		subdiv2.setAttribute("onclick", "highlight_to_edit(this)")
		subdiv2.appendChild(input)
		subdiv.appendChild(subdiv2)
		let tail = document.createElement("div")
		tail.className = "choice-tail"
		subdiv.appendChild(tail)
		return subdiv
	}

	let selected = document.querySelector("#editor .selected")
	if (selected && name == "get_love_level"){
		let input = selected.querySelector("input[name=condition]")
		if (input){
			input.value += `get_love_level( _id_ )`
		}
		return
	}


	let div;
	if (name == "choice"){
		let selected = document.querySelector("#editor .selected")
		if (selected && selected.classList.contains("choice-title")){
			let target = selected.parentNode
			target.after(makeChoice())
		}
		return;
	}
	else if (name == "choice_area"){
		div = document.createElement("div")
		div.className = "choices"
		div.appendChild(makeChoice())
	}
	else{
		div = document.createElement("div")
		div.setAttribute("before", name)
		div.className = "simple-block"
		div.setAttribute("onclick", "highlight_to_edit(this)")

		if (name == "go_to_menu"){
			div.style.setProperty("background", "#ff4040")
		} else{

			let input = document.createElement("input")
			div.appendChild(input)

			if (name == "background"){
				div.classList.add("light")
				input.placeholder = "image"
			}
			else if (name == "progress"){
				div.style.setProperty("background", "orange")
				input.type = "number"
				input.value = 0
				input.min = 0
				input.max = 100
				input.style.width = "40px"
			}
			else if (name == "persona"){
				div.classList.add("persona")
				input.name = "name"
				input.placeholder = "image"
				let input2 = document.createElement("input")
				input2.style.width = "50px"
				input2.name = "id"
				input2.placeholder = "ID"
				div.appendChild(input2)
			}
			else if (name == "init_love_level" || name == "change_love_level"){
				div.classList.add("love")
				if (name == "init_love_level"){
					input.name = "name"
					input.placeholder = "name"
					let input2 = document.createElement("input")
					input2.name = "id"
					input2.placeholder = "ID"
					div.appendChild(input2)
				} else{
					input.name = "id"
					input.placeholder = "ID"
				}
				let input3 = document.createElement("input")
				input3.style.width = "40px"
				input3.name = "value"
				input3.placeholder = "value"
				input3.type = "number"
				if (name == "init_love_level"){
					input3.min = 0
					input3.max = 10
				}
				div.appendChild(input3)
			}
		}
	}

	if (selected){
		if (prepend){
			if (selected.classList.contains("choice-title")){return}
			selected.before(div)
		} else{
			selected.after(div)
		}
	} else{
		document.querySelector("#editor").appendChild(div)
	}
}
