window.onload = _=> main()

function main(){
	document.querySelector("#titles").onclick = _=>{
		if (skiper){skiper()}
	}
	window.addEventListener("keydown", event=>{
		if (event.keyCode == 32 && skiper){skiper()}
	})

	initChapters()
}
