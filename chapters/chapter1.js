document.dispatchEvent(new CustomEvent("chapter-loaded", {
	detail: {
		start: chapter1
	}
}));

function chapter1(){
	init_love_level("boy", 5)
	background('images/chapter1/1.png')
	print("Вы стояли на перекрестке, ожидая зеленый свет своего светофора.", {
		next: _=>{ background('images/chapter1/2.png'); print("Вдруг вы увидели парня сидящего на обочине.", {
			next: _=>{ print("Он был грязный и одет в рваные джинсы и потрепанную куртку.", {
				next: _=>{ background('images/chapter1/3.png'); print("Вы решили подойти к нему.", {
					choices: [
						{
							name: "Тебе нужна помощь?", do: _=> {
								print("<Парень/>: Нет спасибо.", {
									next: _=> {return_to()}
								});
							}
						},
						{
							name: "(Пялиться)", do: _=> {
								change_love_level('boy', -1);
								background('images/chapter1/background1.png');
								persona('images/chapter1/persona-angry.png', "boy")
								print("<Парень/>: Дырку во мне так просверлишь.", {
									next: _=>{ return_to() }
								})
							}
						}
					],
					continue: _=>{
						background('images/chapter1/background1.png');
						persona('images/chapter1/persona-angry.png', "boy")
						print("Не мешай мне отдыхать.", {
							choices: [
								{
									name: "Меня зовут {playername}",
									condition: _=> { get_love_level('boy') >= 5 },
									do: _=>{
										change_love_level('boy', 1);
										background('images/chapter1/background1.png');
										persona('images/chapter1/persona-smile.png', "boy")
										print("Парень посмотрел на вас и улыбнулся.", {
											next: _=> {return_to()}
										})
									}
								},
								{
									name: "(Уйти)", do: _=>{
										persona('', "boy");
										print("Вы ушли дальше по своим делам...", {
											next: _=> {return_to()}
										})
									}
								},
							],
							continue: _=>{
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
