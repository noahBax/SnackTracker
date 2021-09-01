function dumpDatabaseToEmptyPage() {
    let wnd = window.open("about:blank", "", "_blank");
    dataBase.forEach(item => {
        if (wnd) wnd.document.body.innerHTML += (JSON.stringify(item));
    });
}

function resetDatbase() {
    localforage.setItem("database", []);
    localforage.setItem("nameList",[]);
}