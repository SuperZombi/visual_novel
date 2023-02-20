document.dispatchEvent(new CustomEvent("chapter-loaded", {
	detail: {
		start: chapter1
	}
}));

function chapter1(){
	background('images/chapter1/1.png')
	print("Вы стояли на перекрестке, ожидая зеленый свет своего светофора.", {
		next: _=>{ background('images/chapter1/2.png'); print("Вдруг вы увидели парня сидящего на обочине.", {
			next: _=>{ print("Он был грязный и одет в рваные джинсы и потрепанную куртку.", {
				next: _=>{ background('images/chapter1/3.png'); print("Вы решили подойти к нему.", {
					choices: {
						"Тебе нужна помощь?": _=>{
							return_to()
						},
						"(Пялиться)": _=>{
							background('images/chapter1/background1.png');
							persona('images/chapter1/persona-angry.png', "boy")
							print("<Парень/>: Дырку во мне так просверлишь.", {
								choices: {
									"Тебе нужна помощь?": _=>{
										return_to()
									}
								}
							})
						}
					},
					continue: _=>{
						background('images/chapter1/background1.png');
						persona('images/chapter1/persona-smile.png', "boy")
						print("Парень посмотрел на вас и улыбнулся.", {
							next: _=>{
								background('');
								persona('', "boy")
								print("Пока что это всё =)\n(Перезагрузите страницу, чтобы попробовать второй вариант диалога)")
							}
						})
					}
				})}
			})}
		})}
	})
}
