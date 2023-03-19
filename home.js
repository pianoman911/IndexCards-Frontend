function setGroups() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/api/cards/groups", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let json = JSON.parse(xhr.responseText);
                if (json.groups != null) {
                    let groups = json.groups;
                    renderGroups(groups.split(">>>"));
                }
            }
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function renderGroups(groups) {
    groups.forEach(function (group) {
        document.getElementById("grid").innerHTML += '<button onclick="selectGroup(\'' + group + '\')" type="submit" id="group" >' + group + '</button>\n';
    });
}

function selectGroup(group) {
    setCookie("group", group);
    document.location.href = "card.html";
}