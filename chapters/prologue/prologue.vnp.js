print("Кап...", {
    next: _ => {
        print("Кап... Кап...", {
            next: _ => {
                background("chapters/prologue/images/back1.png");
                print("(Вы открываете глаза)", {
                    next: _ => {
                        print("(Похоже на улице снова пошёл дождь...)", {
                            next: _ => {
                                print("(Чёрт. Опять крыша протекает.)", {
                                    next: _ => {
                                        print("(Я же её совсем недавно починил. Неужели опять...?)", {
                                            next: _ => {
                                                background("chapters/prologue/images/back2.png");
                                                print("<Мама/>: О, проснулся?\nИди скорее кушать. Я приготовила твои любимые водоросли.", {
                                                    choices: [{
                                                        name: "Хорошо, уже иду, мам",
                                                        do: _ => {
                                                            return_to();
                                                        }
                                                    }, ],
                                                    continue: _ => {
                                                        progress(10)
                                                        background("chapters/prologue/images/back3.png");
                                                        print("(В дом забежали дети)", {
                                                            next: _ => {
                                                                print("<Ребёнок/>: Ахх. На улице начался такой сильный дождь. Я весь промок.", {
                                                                    next: _ => {
                                                                        background("chapters/prologue/images/back4.png");
                                                                        print("<Мама/>: Иди сюда к горячей печке, чтобы не заболеть.", {
                                                                            next: _ => {
                                                                                print("<Ребёнок 2/>: Фее. Снова есть эти водоросли.\nМама, когда мы уже будем кушать кашку.\nСоседские дети все кушают кашу, почему нам нельзя?", {
                                                                                    next: _ => {
                                                                                        print("<Мама/>: (придумать ответ)", {
                                                                                            next: _ => {
                                                                                                background("chapters/prologue/images/back5.png");
                                                                                                print("(Семья ужинает...)", {
                                                                                                    next: _=>{
                                                                                                        progress(25)
                                                                                                        background("");
                                                                                                        print("", {
                                                                                                            next: _=>{go_to_menu()}
                                                                                                        })
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
})