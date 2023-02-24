function initChapters(){
	document.querySelectorAll("#chapters .chapter").forEach(chap=>{
		chap.onclick = _=>{
			document.querySelector("#menu").classList.add("hide")
			let x = document.createElement("script")
			x.src = chap.getAttribute("url")
			document.head.appendChild(x)
		}
	})
}

document.addEventListener("chapter-loaded", e=>{
	setTimeout(_=>{
		document.querySelector("#game").classList.remove("hide")
		e.detail.start()
	}, 1000)
})

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
			addChoices(args.choices)
		}
		else if (args.next){
			setTimeout(_=>{
				skiper = _=>{
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

		if (array.at(0) == "\n"){
			input.innerHTML += "<br>"
		} else{
			input.innerHTML += array.at(0)
		}
		input.innerHTML += args.end

		if (array.length > 1){
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
				clearChoices()
				e.do()
			}		
		}
		parrent.appendChild(div)
		setTimeout(_=>{div.classList.remove("hide")}, 0)
	})
}


function background(image){
	document.querySelector("#canvas").style.backgroundImage = `url('${image}')`
}
function persona(image, id){
	let div = document.querySelector(`#canvas .persona[persona-id='${id}']`)
	if (!div){
		div = document.createElement("div")
		div.className = "persona"
		div.setAttribute("persona-id", id)
		document.querySelector("#canvas").appendChild(div)
	}
	div.style.backgroundImage = `url('${image}')`
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
	value > 0 ? love_lvl_el.classList.add("up") : love_lvl_el.classList.add("down")
	
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
