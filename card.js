function renderCard(id, question) {
    document.getElementById('card').innerHTML += ' <div class="flip-card-inner" id="flip-card-inner">\n' +
        '    <div class="flip-card-front">' +
        '      <label for="question" class="question"><b>#' + id + ' - Frage:</b></label>\n ' +
        ' <div class="front-container">\n' +
        '       <div class="front-content">\n' +
        '\n' + question + '\n' +
        '<br>' +
        '        <input id="answer" type="text" placeholder="Antwort" name="anwort" required onkeypress="clickCard(event)">' +
        '    </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '    <div onsubmit="clickCard()" class="flip-card-back" id="flip-card-back">\n' +
        '    </div>\n' +
        '  </div>';
    setCookie("card", id, 99999);
    deleteCookie("flipped");
}

function onBack() {
    window.location.href = "home.html";
}

function renderBack() {
    document.getElementById('card').innerHTML += ' <div class="flip-card-inner" id="flip-card-inner">\n' +
        '    <div class="flip-card-front">' +
        '      <label for="question" class="question"><b>Du hast alle Fragen abgearbeitet </b></label>\n ' +
        ' <div class="front-container">\n' +
        '       <div class="front-content">\n' +
        '\nKlicke Hier um auf die Startseite zu gelangen\n' +
        '<br>\n' +
        '         <button class="back" onclick="onBack()" type="submit">Zurück</button>' +
        '    </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '    <div class="flip-card-back" id="flip-card-back">\n' +
        '    </div>\n' +
        '  </div>';
}

function setCard() {
    checkSession();
    let json = {
        "session": getCookie("session"),
        "group": getCookie("group")
    };
    let jsonStr = JSON.stringify(json);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api-indexcards.finndohrmann.de/api/cards/now", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                setCookie("session",getCookie("session"),5)
                let json = JSON.parse(xhr.responseText);
                if (json.id != null) {
                    let id = json.id;
                    let question = json.question;
                    renderCard(id, question)
                }
            } else if (xhr.status === 204) {
                renderBack();
            }
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonStr);
}

function registerListener() {
    document.onkeypress = function (e) {
        if (getCookie("flipped") != null) {
            clickCard(e);
        }
    }
}

function clickCard(e) {
    if (e.keyCode === 13) {
        if (getCookie("flipped") != null) {
            document.location.reload()
        } else {
            checkSession();
            setCookie("flipped", true);
            setTimeout(registerListener, 250)
            let id = getCookie("card");
            let input = document.getElementById("answer").value;
            let json = {
                "session": getCookie("session"),
                "id": id,
                "input": input
            };
            let jsonStr = JSON.stringify(json);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "https://api-indexcards.finndohrmann.de/api/cards/done", true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        setCookie("session",getCookie("session"),5)
                        let json = JSON.parse(xhr.responseText);
                        if (json.time != null) {
                            let time = json.time;
                            let others = json.others;
                            let correct = json.correct;

                            let html;
                            if (correct == null) {
                                html = 'Falsch';
                                document.getElementById('flip-card-back').style.backgroundColor = "#6e1e1e"
                            } else {
                                html = 'Richtig';
                                document.getElementById('flip-card-back').style.backgroundColor = "#1e6e1e"
                            }
                            html += '<br>'
                            if (others.split(">>>")[0].length > 0) {
                                html += 'Andere Antworten: <br>'
                                others.split(">>>").forEach(function (o) {
                                    html += '\n' + o;
                                    html += '<br>'
                                });
                            }
                            html += '<br>'
                            html += 'Die Karte kommt wieder am ' + formatUnix(time);
                            html += '<button class="reload" onclick="document.location.reload()" type="submit">Weiter</button>'

                            document.getElementById('flip-card-back').innerHTML += html;
                            document.getElementById('flip-card-inner').style.transform = "rotateY(180deg)";
                        }
                    }
                }
            }
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(jsonStr);
        }
    }

    function formatUnix(unix) {
        let newDate = new Date();
        newDate.setTime(unix * 1000);

        return newDate.toUTCString();
    }
}