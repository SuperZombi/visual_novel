window.addEventListener("load", main)
function main(){
	document.querySelector("#titles").onclick = _=>{
		if (skiper){skiper()}
	}
	document.querySelector("#screen").addEventListener("dblclick", event=>{
		let path = event.path || (event.composedPath && event.composedPath());
		if(!path.includes(document.querySelector("#titles"))){
			fullscreen()
		}
	})
	window.addEventListener("keydown", event=>{
		if (event.keyCode == 32 && skiper){skiper()}
		if (event.keyCode == 70){fullscreen()}
	})

	document.querySelector("#menu-preloader").classList.add("hide");
	initChapters()

	let search = Object.fromEntries(new URLSearchParams(window.location.search))
	if (search.from_file){
		document.querySelector("#menu").classList.add("hide")
		try{
			let content = window.localStorage.getItem("execute_from_file")
			startChapter(content)
		} catch (e){
			setTimeout(_=>{
				alert(e)
			}, 100)
		}
	}
}


var current_chapter;
function initChapters(){
	document.querySelectorAll("#chapters .chapter").forEach(chap=>{
		chap.onclick = _=>{
			document.querySelector("#menu-preloader").classList.remove("hide")
			document.querySelector("#menu").classList.add("hide")
			fetch(chap.getAttribute("url")).then(async req=>{
				if (req.status == 200){
					let data = await req.text()
					current_chapter = chap
					startChapter(data)
				} else{
					setTimeout(_=>{alert("Error")}, 100)
					go_to_menu()
				}
			})
		}
	})
}
function startChapter(text){
	document.querySelector("#canvas").style = ""
	document.querySelector("#canvas").innerHTML = ""
	document.querySelector("#choices").innerHTML = ""
	var F = new Function(text);
	setTimeout(_=>{
		document.querySelector("#menu-preloader").classList.add("hide")
		document.querySelector("#game").classList.remove("hide")
		F();
	}, 1000)
}
document.addEventListener("chapter-loaded", e=>{
	e.detail.start()
})

function fullscreen(){
	if (document.fullscreenElement){
		document.querySelector("#fullscreen").classList.remove("fa-compress")
		document.querySelector("#fullscreen").classList.add("fa-expand")
		document.exitFullscreen()
	} else{
		document.body.requestFullscreen()
		document.querySelector("#fullscreen").classList.remove("fa-expand")
		document.querySelector("#fullscreen").classList.add("fa-compress")
	}
}

function go_to_menu(){
	document.querySelector("#game").classList.add("hide")
	setTimeout(_=>{
		document.querySelector("#menu").classList.remove("hide")
	}, 500)
}
function progress(val){
	if (current_chapter){
		current_chapter.querySelector("progress").value = val;
	}
}

function clear(){
	document.querySelector("#titles-text").innerHTML = ""
}
var skiper;
var _return_to = [];


function return_to(){
	if (_return_to.length > 0){
		let f = _return_to.pop();
		f();
	}
}
function print(text, args=null){
	clear()
	let default_args = {
		speed: 50,
		end: ""
	}
	args = {...default_args, ...args}

	let _speed = args.speed;
	let input = document.querySelector("#titles-text")
	let _stop = false;

	function after(){
		if (args.continue){
			_return_to.push(_=>{
				args.continue()
			})
		}
		if (args.choices){
			if (image_request){
				image_request.addEventListener("load", _=>{
					addChoices(args.choices)
				})
			} else { addChoices(args.choices) }
		}
		else if (args.next){
			setTimeout(_=>{
				skiper = _=>{
					if (image_request){return}
					args.next()
				}
			}, 100)
		}
	}
	
	function _print(array){
		if (_stop){return}
		if (args.end != "" && input.innerHTML.endsWith(args.end)){
			input.innerHTML = input.innerHTML.slice(0, -1)
		}

		if (array.length >= 1){
			if (array.at(0) == "\n"){
				input.innerHTML += "<br>"
			} else{
				input.innerHTML += array.at(0)
			}
			input.innerHTML += args.end

			setTimeout(_=>{
				_print(array.slice(1))
			}, _speed)
		} else{
			if (args.end != ""){
				input.innerHTML = input.innerHTML.slice(0, -1)
			}
			after()
		}
		input.scrollTo(0, input.scrollHeight);
	}

	const regex = /(<)(.+)(\/>)/;
	let result = text.match(regex);
	if (result){
		text = text.replaceAll(result[0], "<persona>" + result[2] + "</persona>")
	}
	
	const separator = /(<persona>.+<\/persona>)|(\n)/;
	_print(
		text.split(separator).filter(x=>x)
				.map(x => x.match(separator) ? x : x.split(""))
				.flat(1)
	)
	
	skiper = function(exit=false){
		if (exit){_stop = true}
		_speed = 0;
	}
}


function clearChoices(){
	document.querySelectorAll("#choices .choice").forEach(e=>{
		e.classList.add("hide")
		e.addEventListener("transitionend", _=>{
			e.remove()
		})
	})
}
function addChoices(array){
	clearChoices()
	let parrent = document.querySelector("#choices");
	array.forEach(e=>{
		let div = document.createElement("div")
		div.classList.add("choice", "hide")
		div.innerHTML = e.name
		
		let canClick = true;
		if (e.condition){
			const regex = /{([^}]+)}/;
			let match = regex.exec(e.condition);
			let F = new Function("return " + match[1]);
			if (!F()){
				div.classList.add("disabled")
				canClick = false;
			}
		}
		if (canClick){
			div.onclick = _=>{
				if (image_request){return}
				clearChoices()
				e.do()
			}		
		}
		parrent.appendChild(div)
		setTimeout(_=>{div.classList.remove("hide")}, 10)
	})
}


var image_request;
async function load_image(src){
	if (image_request){
		image_request.abort();
	}
	document.querySelector("#game-preloader").classList.remove("hide")
	return new Promise(function (resolve, reject) {
		image_request = new XMLHttpRequest();
		image_request.open('GET', src);
		image_request.responseType = 'blob';
		image_request.onload = function () {
			if (image_request.status === 200) {
				document.querySelector("#game-preloader").classList.add("hide")
				const imageObjectURL = URL.createObjectURL(image_request.response);
				image_request = null;
				resolve(imageObjectURL);
			}
		}
		image_request.send();
	})
}
async function background(image){
	let canvas = document.querySelector("#canvas")
	if (image){
		if (!canvas.style.backgroundImage){
			canvas.style.setProperty("transition", "0s")
			canvas.style.setProperty("opacity", 0)
			setTimeout(_=>{
				canvas.style.removeProperty("transition")
			}, 0)
		}
		canvas.style.backgroundImage = `url('${await load_image(image)}')`
		canvas.style.removeProperty("opacity")
	} else{
		canvas.style.setProperty("opacity", 0)
	}
}
function persona(image, id){
	let div = document.querySelector(`#canvas .persona[persona-id='${id}']`)
	if (!div){
		div = document.createElement("div")
		div.className = "persona"
		div.setAttribute("persona-id", id)
		document.querySelector("#canvas").appendChild(div)
	}
	if (image){
		div.style.backgroundImage = `url('${image}')`
	} else{
		div.style.backgroundImage = ''
	}
}

var love_levels = {}
function get_love_level(id){
	return love_levels[id]
}
function setProgressValue(progress, value){
	let max = progress.getAttribute("max") || 100;
	let val = Math.max(Math.min(value, max), 0)
	progress.setAttribute("value", val)
	let percents = value * 100 / max;
	progress.style.setProperty('--value', percents)
}

var hideTimeout;
function change_love_level(id, value){
	love_levels[id] += value;
	let love_lvl_el = document.querySelector(".love-level")
	let progress = love_lvl_el.querySelector(".progress")

	if (hideTimeout){
		clearTimeout(hideTimeout)
		love_lvl_el.classList.remove("up", "down")
	}

	love_lvl_el.classList.remove("hidden")
	value != 0 ? (value > 0 ? love_lvl_el.classList.add("up") : love_lvl_el.classList.add("down")) : null;
	
	setTimeout(_=>{
		setProgressValue(progress, love_levels[id])
	}, 500)

	hideTimeout = setTimeout(_=>{
		document.querySelector(".love-level").classList.add("hidden")
		love_lvl_el.classList.remove("up", "down")
	}, 3000)
}
function init_love_level(name, id, value){
	love_levels[id] = value
	document.querySelector(".love-level .title").innerHTML = name
	setProgressValue(document.querySelector(".love-level .progress"), value)
}
