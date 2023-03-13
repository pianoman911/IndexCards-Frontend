function renderCard(id, question) {
    document.getElementById('card').innerHTML += ' <div class="flip-card-inner" id="flip-card-inner">\n' +
        '    <div class="flip-card-front">' +
        '      <label for="question" class="question"><b>#' + id + ' - Frage:</b></label>\n ' +
        ' <div class="front-container">\n' +
        '       <div class="front-content">\n' +
        '\n' + question + '\n' +
        '        <input id="answer" type="text" placeholder="Antwort" name="anwort" required onkeypress="clickCard(event)">' +
        '    </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '    <div class="flip-card-back" id="flip-card-back">\n' +
        '    </div>\n' +
        '  </div>';
    setCookie("card", id, 99999);
}

function setCard() {
    checkSession();
    var json = {
        "session": getCookie("session"),
    };
    var jsonStr = JSON.stringify(json);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/api/cards/now", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                if (json.id != null) {
                    var id = json.id;
                    var question = json.question;
                    renderCard(id, question)
                }
            }
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonStr);
}

function clickCard(e) {
    if (e.keyCode === 13) {
        checkSession();
        var id = getCookie("card");
        var input = document.getElementById("answer").value;
        var json = {
            "session": getCookie("session"),
            "id": id,
            "input": input
        };
        var jsonStr = JSON.stringify(json);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8080/api/cards/done", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText);
                    if (json.time != null) {
                        var time = json.time;
                        var others = json.others;
                        var correct = json.correct;

                        var html;
                        if (correct == null) {
                            html = 'Falsch';
                            document.getElementById('flip-card-back').style.backgroundColor = "red"
                        } else {
                            html = 'correct';
                            document.getElementById('flip-card-back').style.backgroundColor = "lawngreen"
                        }
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