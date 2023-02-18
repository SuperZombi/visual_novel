window.onload = _=> main()

function main(){
	document.querySelector("#titles").onclick = _=>{
		if (skiper){skiper()}
	}
	window.addEventListener("keydown", event=>{
		if (event.keyCode == 32 && skiper){skiper()}
	})

	chapter1()
}

function chapter1(){
	print("Вы стояли на перекрестке, ожидая зеленый свет своего светофора, когда вдруг увидели парня сидящего на обочине.", {
		next: _=>{
			print("Он был грязный и одет в рваные джинсы и потрепанную куртку.", {
				next: _=>{
					print("Вы решили подойти к нему.", {
						choices: {
							"Тебе нужна помощь?": _=>{
								return_to()
							},
							"(Пялиться)": _=>{
								print("Парень: Дырку во мне так просверлишь.", {
									choices: {
										"Тебе нужна помощь?": _=>{
											return_to()
										}
									}
								})
							}
						},
						continue: _=>{
							print("Парень посмотрел на вас и улыбнулся.")
						}
					})
				}
			})
		}
	})
}
