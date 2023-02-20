window.onload = _=> main()

function main(){
	document.querySelector("#titles").onclick = _=>{
		if (skiper){skiper()}
	}
	window.addEventListener("keydown", event=>{
		if (event.keyCode == 32 && skiper){skiper()}
	})

	initChapters()

	let search = Object.fromEntries(new URLSearchParams(window.location.search))
	if (search.from_file){
		document.querySelector("#menu").classList.add("hide")
		try{
			let content = window.localStorage.getItem("execute_from_file")
			var F = new Function (content);
			document.dispatchEvent(new CustomEvent("chapter-loaded", {
				detail: {
					start: F
				}
			}));
		} catch (e){
			setTimeout(_=>{
				alert(e)
			}, 100)
		}
	}
}
