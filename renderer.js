const { dialog } = require('electron').remote;
const { BrowserWindow } = require('electron').remote;
const fs = require('fs');
const path = require('path');

var directory = null;

$("#open").click(function () {
    directory = dialog.showOpenDialog({ properties: ['openDirectory'] });
    $("#file-info").empty();
    getFiles(directory.toString());
});

$('#output').on("click", "#del-btn", function() {
    var dirToDelete = $(this).closest('tr').attr('id');
    dialog.showMessageBox({message: "Do you want to premantly delete this file?", 
        type: "question",
        title: "Delete",
        buttons: ["Yes", "No"]}, resp => {
        if(resp === 0){
            fs.unlinkSync(dirToDelete);
            $(this).closest('tr').remove();
            alert("File deleted Successfully");
        }
    });
    
});

function getFiles(dir) {
    var minSize = $('input[name=size]:checked').val();
    var ext = '';
    var total = 0;
    var showing = 0;

    fs.readdir(dir, (err, files) => {
        //console.log(dir);
        for (let file of files) {
            total++;
            const fullPath = dir + "/" + file;
            const size = getFileSizeMB(fullPath);
            ext = path.extname(fullPath);

            if (size >= minSize) {
                $("#output").append("<tr id='" + fullPath + "'><td>" + ext + "</td><td>" + file + "</td>" + "<td>" + size.toFixed(2) +
                    "</td><td><button id='del-btn' class='btn btn-link'><i class='fa fa-trash-o' aria-hidden='true'></i></button></td></tr>");

                showing++;
            }
        }

        $("#path").attr("placeholder", dir);
        $("#total-files").text(total);
        $("#showing-files").text(showing);
    });
}

$("#fsize-btns :input").change(function () {
    if (directory != null) {
        $("#file-info").empty();
        getFiles(directory.toString());
    }
});

function getFileSizeMB(file) {
    const stats = fs.statSync(file);
    const fileSize = stats.size / 1048576.0;

    return fileSize;
}

